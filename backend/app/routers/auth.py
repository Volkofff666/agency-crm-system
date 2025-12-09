from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.schemas.user import LoginRequest, Token, User as UserSchema, UserCreate
from app.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_admin_user,
    get_password_hash
)

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Вход в систему
    """
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Обновляем last_login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Создаем токен
    access_token = create_access_token(data={
        "user_id": user.id,
        "username": user.username,
        "role": user.role
    })
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Регистрация нового пользователя (только для админа)
    """
    # Проверяем, существует ли пользователь
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    
    # Создаем пользователя
    user_dict = user_data.dict(exclude={'password'})
    user_dict['hashed_password'] = get_password_hash(user_data.password)
    
    new_user = User(**user_dict)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.get("/me", response_model=UserSchema)
def get_me(
    current_user: User = Depends(get_current_user)
):
    """
    Получить информацию о текущем пользователе
    """
    return current_user
