"use client"

import { useState, useEffect } from "react"
import {
  User,
  BookOpen,
  LogOut,
  GraduationCap,
  FileText,
  Calendar,
  MessageSquare,
  ClipboardList,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
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
import { ThemeToggle } from "@/components/theme-toggle"
import type { User as UserType } from "@/lib/auth"


interface PaiDashboardProps {
  user: UserType
  onLogout: () => void
}

interface Student {
  id: string
  name: string
  grade: string
  specialNeeds: string
  teacher: string
  teacherEmail: string
}

interface Activity {
  id: string
  title: string
  description: string
  date: Date
  status: "planejada" | "em-andamento" | "concluida"
  feedback?: string
  rating?: number
}

interface Message {
  id: string
  from: string
  fromRole: "professor" | "pai"
  content: string
  date: Date
  isRead: boolean
}


export function PaiDashboard({ user, onLogout }: PaiDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [students, setStudents] = useState<Student[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [newMessage, setNewMessage] = useState("")
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {

    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Ana Silva Santos",
        grade: "3º Ano",
        specialNeeds: "Dislexia",
        teacher: "Maria Silva",
        teacherEmail: "prof1@aee.edu.br",
      },
    ]

    const mockActivities: Activity[] = [
      {
        id: "1",
        title: "Atividade de Leitura Adaptada",
        description: "Exercícios de leitura com fonte ampliada e espaçamento adequado para dislexia",
        date: new Date("2024-03-15"),
        status: "concluida",
        feedback: "Ana demonstrou grande melhora na velocidade de leitura!",
        rating: 4,
      },
      {
        id: "2",
        title: "Exercícios de Coordenação Motora",
        description: "Atividades para desenvolver coordenação motora fina através de desenhos e escrita",
        date: new Date("2024-03-20"),
        status: "em-andamento",
      },
      {
        id: "3",
        title: "Jogos Educativos Adaptados",
        description: "Jogos de matemática com elementos visuais para facilitar o aprendizado",
        date: new Date("2024-03-25"),
        status: "planejada",
      },
    ]

    const mockMessages: Message[] = [
      {
        id: "1",
        from: "Maria Silva",
        fromRole: "professor",
        content:
          "Olá! Gostaria de conversar sobre o progresso da Ana na leitura. Ela tem mostrado uma evolução muito positiva!",
        date: new Date("2024-03-18"),
        isRead: false,
      },
      {
        id: "2",
        from: "João Santos",
        fromRole: "pai",
        content: "Obrigado pelo feedback! Em casa também notamos que ela está mais confiante para ler.",
        date: new Date("2024-03-19"),
        isRead: true,
      },
    ]
    setStudents(mockStudents)
    setActivities(mockActivities)
    setMessages(mockMessages)
  }
  const handleFeedback = (activity: Activity) => {
    setSelectedActivity(activity)
    setFeedback(activity.feedback || "")
    setRating(activity.rating || 0)
    setIsFeedbackOpen(true)
  }

  const submitFeedback = () => {
    if (selectedActivity) {
      const updatedActivities = activities.map((act) =>
        act.id === selectedActivity.id ? { ...act, feedback, rating } : act,
      )
      setActivities(updatedActivities)
      setAlertMessage("Feedback enviado com sucesso!")
      setIsFeedbackOpen(false)
    }
  }
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        from: user.name,
        fromRole: "pai",
        content: newMessage,
        date: new Date(),
        isRead: true,
      }
      setMessages((prev) => [...prev, message])
      setNewMessage("")
      setAlertMessage("Mensagem enviada com sucesso!")
      setIsMessageOpen(false)
    }
  }

  const markAsRead = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)))
  }
  const stats = {
    totalActivities: activities.length,
    completedActivities: activities.filter((a) => a.status === "concluida").length,
    inProgressActivities: activities.filter((a) => a.status === "em-andamento").length,
    unreadMessages: messages.filter((m) => !m.isRead && m.fromRole === "professor").length,
  }
}