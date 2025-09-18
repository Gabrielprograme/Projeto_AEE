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

        {/* Main Content */}
        <main className="flex-1 p-6">
          {message && (
            <Alert className="mb-6">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Visão Geral</h2>
                <p className="text-muted-foreground">Resumo das suas atividades e alunos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pais Cadastrados</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalParents}</div>
                    <p className="text-xs text-muted-foreground">Responsáveis ativos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alunos</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Alunos cadastrados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Atividades</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalActivities}</div>
                    <p className="text-xs text-muted-foreground">Total de atividades</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingActivities}</div>
                    <p className="text-xs text-muted-foreground">Atividades planejadas</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximas Atividades</CardTitle>
                    <CardDescription>Atividades programadas para os próximos dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <ClipboardList className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {students.find((s) => s.id === activity.studentId)?.name}
                            </p>
                          </div>
                          <Badge variant="outline">{activity.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alunos Recentes</CardTitle>
                    <CardDescription>Últimos alunos cadastrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {students.slice(0, 3).map((student) => (
                        <div key={student.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.grade}</p>
                          </div>
                          <Badge variant="secondary">{student.specialNeeds}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "parents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Pais e Responsáveis</h2>
                  <p className="text-muted-foreground">Gerencie os pais e responsáveis dos seus alunos</p>
                </div>

                <Dialog open={isCreateParentOpen} onOpenChange={setIsCreateParentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Novo Responsável
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Pai/Responsável</DialogTitle>
                      <DialogDescription>Adicione um novo responsável ao sistema</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateParent} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="parent-name">Nome Completo</Label>
                        <Input
                          id="parent-name"
                          value={newParent.name}
                          onChange={(e) => setNewParent((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parent-email">Email</Label>
                        <Input
                          id="parent-email"
                          type="email"
                          value={newParent.email}
                          onChange={(e) => setNewParent((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parent-password">Senha</Label>
                        <div className="relative">
                          <Input
                            id="parent-password"
                            type={showPassword ? "text" : "password"}
                            value={newParent.password}
                            onChange={(e) => setNewParent((prev) => ({ ...prev, password: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Cadastrar
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateParentOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Responsáveis</CardTitle>
                  <CardDescription>Pais e responsáveis cadastrados por você</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {parents.map((parent) => (
                      <div key={parent.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {parent.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{parent.name}</p>
                            <p className="text-sm text-muted-foreground">{parent.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Pai/Responsável</Badge>
                          <Button variant="ghost" size="icon">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {parents.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum responsável cadastrado ainda</p>
                        <p className="text-sm">Clique em "Novo Responsável" para começar</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Alunos</h2>
                  <p className="text-muted-foreground">Gerencie os alunos sob sua responsabilidade</p>
                </div>

                <Dialog open={isCreateStudentOpen} onOpenChange={setIsCreateStudentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Novo Aluno
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
                      <DialogDescription>Adicione um novo aluno ao sistema</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateStudent} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-name">Nome do Aluno</Label>
                        <Input
                          id="student-name"
                          value={newStudent.name}
                          onChange={(e) => setNewStudent((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parent-select">Responsável</Label>
                        <select
                          id="parent-select"
                          className="w-full p-2 border rounded-md"
                          value={newStudent.parentEmail}
                          onChange={(e) => setNewStudent((prev) => ({ ...prev, parentEmail: e.target.value }))}
                          required
                        >
                          <option value="">Selecione um responsável</option>
                          {parents.map((parent) => (
                            <option key={parent.id} value={parent.email}>
                              {parent.name} ({parent.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student-grade">Série/Ano</Label>
                        <Input
                          id="student-grade"
                          value={newStudent.grade}
                          onChange={(e) => setNewStudent((prev) => ({ ...prev, grade: e.target.value }))}
                          placeholder="Ex: 3º Ano, 5ª Série"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="special-needs">Necessidades Especiais</Label>
                        <Textarea
                          id="special-needs"
                          value={newStudent.specialNeeds}
                          onChange={(e) => setNewStudent((prev) => ({ ...prev, specialNeeds: e.target.value }))}
                          placeholder="Descreva as necessidades especiais do aluno"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Cadastrar Aluno
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateStudentOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
                          <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar alunos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

                 <Card>
                <CardHeader>
                  <CardTitle>Lista de Alunos</CardTitle>
                  <CardDescription>Alunos cadastrados no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.grade} • Responsável: {student.parentName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{student.specialNeeds}</Badge>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredStudents.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum aluno encontrado</p>
                        <p className="text-sm">Cadastre responsáveis primeiro, depois adicione alunos</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === "activities" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Atividades</h2>
                  <p className="text-muted-foreground">Planeje e acompanhe atividades para seus alunos</p>
                </div>

                <Dialog open={isCreateActivityOpen} onOpenChange={setIsCreateActivityOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Nova Atividade
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Atividade</DialogTitle>
                      <DialogDescription>Planeje uma nova atividade para um aluno</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateActivity} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity-student">Aluno</Label>
                        <select
                          id="activity-student"
                          className="w-full p-2 border rounded-md"
                          value={newActivity.studentId}
                          onChange={(e) => setNewActivity((prev) => ({ ...prev, studentId: e.target.value }))}
                          required
                        >
                          <option value="">Selecione um aluno</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name} ({student.grade})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activity-title">Título da Atividade</Label>
                        <Input
                          id="activity-title"
                          value={newActivity.title}
                          onChange={(e) => setNewActivity((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activity-description">Descrição</Label>
                        <Textarea
                          id="activity-description"
                          value={newActivity.description}
                          onChange={(e) => setNewActivity((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Descreva a atividade e seus objetivos"
                          required
                        />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="activity-date">Data Planejada</Label>
                        <Input
                          id="activity-date"
                          type="date"
                          value={newActivity.date}
                          onChange={(e) => setNewActivity((prev) => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Criar Atividade
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateActivityOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Atividades</CardTitle>
                  <CardDescription>Atividades planejadas e em andamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{activity.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Aluno: {students.find((s) => s.id === activity.studentId)?.name}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.status === "concluida"
                                ? "default"
                                : activity.status === "em-andamento"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {activity.status}
                          </Badge>
                          </div>
                        <p className="text-sm mb-3">{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Data: {activity.date.toLocaleDateString("pt-BR")}
                          </p>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Comentar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                                        {activities.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma atividade criada ainda</p>
                        <p className="text-sm">Clique em "Nova Atividade" para começar</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

                 {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Relatórios</h2>
                <p className="text-muted-foreground">Relatórios de progresso e atividades</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Relatório de Alunos</CardTitle>
                    <CardDescription>Progresso e desenvolvimento dos alunos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Gerar Relatório</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Relatório de Atividades</CardTitle>
                    <CardDescription>Atividades realizadas e planejadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Gerar Relatório</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
