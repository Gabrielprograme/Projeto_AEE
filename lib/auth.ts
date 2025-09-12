export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "professor" | "pai"
  createdBy?: string
  createdAt: Date
  isActive: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

// Dados simulados para demonstração
const users: User[] = [
  {
    id: "1",
    email: "admin@aee.edu.br",
    name: "Administrador Principal",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "2",
    email: "prof1@aee.edu.br",
    name: "Maria Silva",
    role: "professor",
    createdBy: "1",
    createdAt: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "3",
    email: "pai1@email.com",
    name: "João Santos",
    role: "pai",
    createdBy: "2",
    createdAt: new Date("2024-02-01"),
    isActive: true,
  },
]

// Senhas simuladas (em produção seria hash)
const passwords: Record<string, string> = {
  "admin@aee.edu.br": "admin123",
  "prof1@aee.edu.br": "prof123",
  "pai1@email.com": "pai123",
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User | null> {
    const user = users.find((u) => u.email === credentials.email && u.isActive)
    if (user && passwords[credentials.email] === credentials.password) {
      return user
    }
    return null
  }

  static async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem("aee_user")
    return userData ? JSON.parse(userData) : null
  }

  static async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("aee_user")
    }
  }

  static async createUser(
    userData: Omit<User, "id" | "createdAt">,
    password: string,
    createdBy: string,
  ): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      createdBy,
    }

    users.push(newUser)
    passwords[newUser.email] = password

    return newUser
  }

  static async getAllUsers(): Promise<User[]> {
    return users.filter((u) => u.isActive)
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) return null

    users[userIndex] = { ...users[userIndex], ...updates }
    return users[userIndex]
  }

  static async deleteUser(id: string): Promise<boolean> {
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) return false

    users[userIndex].isActive = false
    return true
  }

  static async updatePassword(email: string, newPassword: string): Promise<boolean> {
    if (passwords[email]) {
      passwords[email] = newPassword
      return true
    }
    return false
  }
}
