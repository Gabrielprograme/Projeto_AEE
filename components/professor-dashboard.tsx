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

