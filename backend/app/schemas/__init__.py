# Client schemas
from app.schemas.client import (
    Client,
    ClientCreate,
    ClientUpdate,
    Contact,
    ContactCreate,
)

# Project schemas
from app.schemas.project import (
    Project,
    ProjectCreate,
    ProjectUpdate,
)

# Task schemas
from app.schemas.task import (
    Task,
    TaskCreate,
    TaskUpdate,
)

# Proposal schemas
from app.schemas.proposal import (
    Proposal,
    ProposalCreate,
    ProposalUpdate,
    ProposalItem,
    ProposalItemCreate,
)

# Invoice schemas
from app.schemas.invoice import (
    Invoice,
    InvoiceCreate,
    InvoiceUpdate,
    InvoiceItem,
    InvoiceItemCreate,
)

# User schemas
from app.schemas.user import (
    User,
    UserCreate,
    UserUpdate,
    Token,
    TokenData,
    LoginRequest,
)

__all__ = [
    # Client
    'Client',
    'ClientCreate',
    'ClientUpdate',
    'Contact',
    'ContactCreate',
    # Project
    'Project',
    'ProjectCreate',
    'ProjectUpdate',
    # Task
    'Task',
    'TaskCreate',
    'TaskUpdate',
    # Proposal
    'Proposal',
    'ProposalCreate',
    'ProposalUpdate',
    'ProposalItem',
    'ProposalItemCreate',
    # Invoice
    'Invoice',
    'InvoiceCreate',
    'InvoiceUpdate',
    'InvoiceItem',
    'InvoiceItemCreate',
    # User
    'User',
    'UserCreate',
    'UserUpdate',
    'Token',
    'TokenData',
    'LoginRequest',
]
