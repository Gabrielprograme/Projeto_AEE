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
