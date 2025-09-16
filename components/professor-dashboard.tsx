"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Users,
  UserPlus,
  BookOpen,
  LogOut,
  GraduationCap,
  FileText,
  Calendar,
  Search,
  Edit,
  Eye,
  EyeOff,
  ClipboardList,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthService, type User } from "@/lib/auth"

interface ProfessorDashboardProps {
  user: User
  onLogout: () => void
}

interface Student {
  id: string
  name: string
  parentEmail: string
  parentName: string
  grade: string
  specialNeeds: string
  createdAt: Date
  isActive: boolean
}

interface Activity {
  id: string
  studentId: string
  title: string
  description: string
  date: Date
  status: "planejada" | "em-andamento" | "concluida"
}

export function ProfessorDashboard({ user, onLogout }: ProfessorDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [parents, setParents] = useState<User[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [isCreateParentOpen, setIsCreateParentOpen] = useState(false)
  const [isCreateStudentOpen, setIsCreateStudentOpen] = useState(false)
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [newStudent, setNewStudent] = useState({
    name: "",
    parentEmail: "",
    grade: "",
    specialNeeds: "",
  })
  const [newActivity, setNewActivity] = useState({
    studentId: "",
    title: "",
    description: "",
    date: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadData()
  }, [])

    const loadData = async () => {
    const allUsers = await AuthService.getAllUsers()
    const parentsCreatedByMe = allUsers.filter((u) => u.role === "pai" && u.createdBy === user.id)
    setParents(parentsCreatedByMe)

    // Simular dados de alunos e atividades
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Ana Silva Santos",
        parentEmail: "pai1@email.com",
        parentName: "João Santos",
        grade: "3º Ano",
        specialNeeds: "Dislexia",
        createdAt: new Date("2024-02-01"),
        isActive: true,
      },
    ]

    const mockActivities: Activity[] = [
      {
        id: "1",
        studentId: "1",
        title: "Atividade de Leitura Adaptada",
        description: "Exercícios de leitura com fonte ampliada e espaçamento adequado para dislexia",
        date: new Date("2024-03-15"),
        status: "planejada",
      },
    ]

    setStudents(mockStudents)
    setActivities(mockActivities)
  }

  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await AuthService.createUser(
        {
          name: newParent.name,
          email: newParent.email,
          role: "pai",
          isActive: true,
        },
        newParent.password,
        user.id,
      )
      setMessage("Pai/Responsável criado com sucesso!")
      setNewParent({ name: "", email: "", password: "" })
      setIsCreateParentOpen(false)
      loadData()
    } catch (error) {
      setMessage("Erro ao criar pai/responsável")
    }
  }

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    const newStudentData: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      parentEmail: newStudent.parentEmail,
      parentName: parents.find((p) => p.email === newStudent.parentEmail)?.name || "",
      grade: newStudent.grade,
      specialNeeds: newStudent.specialNeeds,
      createdAt: new Date(),
      isActive: true,
    }

    setStudents((prev) => [...prev, newStudentData])
    setMessage("Aluno cadastrado com sucesso!")
    setNewStudent({ name: "", parentEmail: "", grade: "", specialNeeds: "" })
    setIsCreateStudentOpen(false)
  }

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    const newActivityData: Activity = {
      id: Date.now().toString(),
      studentId: newActivity.studentId,
      title: newActivity.title,
      description: newActivity.description,
      date: new Date(newActivity.date),
      status: "planejada",
    }

    setActivities((prev) => [...prev, newActivityData])
    setMessage("Atividade criada com sucesso!")
    setNewActivity({ studentId: "", title: "", description: "", date: "" })
    setIsCreateActivityOpen(false)
  }

  const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const stats = {
    totalParents: parents.length,
    totalStudents: students.length,
    totalActivities: activities.length,
    pendingActivities: activities.filter((a) => a.status === "planejada").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Sistema AEE</h1>
              <p className="text-sm text-muted-foreground">Painel do Professor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">Professor</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Visão Geral
            </Button>
            <Button
              variant={activeTab === "students" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("students")}
            >
              <Users className="w-4 h-4 mr-2" />
              Alunos
            </Button>
            <Button
              variant={activeTab === "parents" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("parents")}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Pais/Responsáveis
            </Button>
            <Button
              variant={activeTab === "activities" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("activities")}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Atividades
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
          </nav>
        </aside>

        