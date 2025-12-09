#!/usr/bin/env python3
"""
Скрипт для создания первого администратора
Использование:
  python create_admin.py
"""

import sys
from app.database import SessionLocal
from app.models.user import User
from app.auth import get_password_hash

def create_admin():
    db = SessionLocal()
    
    # Проверяем, есть ли уже админ
    existing_admin = db.query(User).filter(User.role == "admin").first()
    if existing_admin:
        print(f"WARNING: Админ уже существует: {existing_admin.username}")
        print(f"INFO: Email: {existing_admin.email}")
        
        response = input("\nСоздать еще одного админа? (y/n): ")
        if response.lower() != 'y':
            print("CANCELLED: Отменено")
            return
    
    print("\n=== Создание администратора ===")
    
    # Ввод данных
    email = input("Email: ").strip()
    if not email:
        print("ERROR: Email не может быть пустым")
        return
    
    username = input("Username: ").strip()
    if not username:
        print("ERROR: Username не может быть пустым")
        return
    
    full_name = input("Полное имя: ").strip()
    if not full_name:
        print("ERROR: Полное имя не может быть пустым")
        return
    
    import getpass
    password = getpass.getpass("Пароль: ")
    if not password or len(password) < 6:
        print("ERROR: Пароль должен быть минимум 6 символов")
        return
    
    password_confirm = getpass.getpass("Повторите пароль: ")
    if password != password_confirm:
        print("ERROR: Пароли не совпадают")
        return
    
    # Проверяем уникальность
    existing = db.query(User).filter(
        (User.email == email) | (User.username == username)
    ).first()
    
    if existing:
        print("ERROR: Пользователь с таким email или username уже существует")
        return
    
    # Создаем админа
    admin = User(
        email=email,
        username=username,
        full_name=full_name,
        hashed_password=get_password_hash(password),
        role="admin",
        is_active=True
    )
    
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    print("\nSUCCESS: Администратор успешно создан!")
    print(f"INFO: ID: {admin.id}")
    print(f"INFO: Email: {admin.email}")
    print(f"INFO: Username: {admin.username}")
    print(f"INFO: Имя: {admin.full_name}")
    print(f"INFO: Роль: {admin.role}")
    print("\nINFO: Теперь вы можете войти в систему!")
    
    db.close()

if __name__ == "__main__":
    try:
        create_admin()
    except KeyboardInterrupt:
        print("\n\nCANCELLED: Отменено пользователем")
        sys.exit(0)
    except Exception as e:
        print(f"\nERROR: {e}")
        sys.exit(1)
