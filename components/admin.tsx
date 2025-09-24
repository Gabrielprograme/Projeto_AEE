import { useState, useReducer } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { UserIcon, SettingsIcon, LogOut, MoveLeft, Users, UserPlus } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

// ===== TIPOS E INTERFACES =====
type AdminPageProps = {
  onExit?: () => void;
};

type MenuType = "alunos" | "professores" | "pais";

type Student = {
  id: string;
  name: string;
  status: "active" | "inactive";
  parents: string[];
};

type Teacher = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
};

type Parent = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  students: string[];
};

type AdminState = {
  currentView: "dashboard" | MenuType | "settings";
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  systemSettings: {
    systemName: string;
    contactEmail: string;
    defaultTheme: string;
  };
};

type AdminAction =
  | { type: "SET_VIEW"; payload: AdminState["currentView"] }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AdminState["systemSettings"]> };

// ===== REDUCER SIMPLIFICADO =====
const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, currentView: action.payload };
    
    case "UPDATE_SETTINGS":
      return {
        ...state,
        systemSettings: { ...state.systemSettings, ...action.payload }
      };
    
    default:
      return state;
  }
};

// ===== DADOS INICIAIS =====
const initialAdminState: AdminState = {
  currentView: "alunos",
  students: [
    { 
      id: "1", 
      name: "Lucas Pereira", 
      status: "active",
      parents: ["1", "2"]
    },
    { 
      id: "2", 
      name: "Fernanda Lima", 
      status: "inactive",
      parents: ["3"]
    },
    { 
      id: "3", 
      name: "Carlos Santos", 
      status: "active",
      parents: ["1"]
    }
  ],
  teachers: [
    { id: "1", name: "Maria Silva", email: "maria@escola.com", status: "active" },
    { id: "2", name: "Ana Costa", email: "ana@escola.com", status: "inactive" }
  ],
  parents: [
    { id: "1", name: "João Souza", email: "joao@escola.com", status: "active", students: ["1", "3"] },
    { id: "2", name: "Patrícia Gomes", email: "patricia@escola.com", status: "active", students: ["1"] },
    { id: "3", name: "Roberto Lima", email: "roberto@escola.com", status: "active", students: ["2"] }
  ],
  systemSettings: {
    systemName: "Sistema AEE",
    contactEmail: "contato@aee.com",
    defaultTheme: "system"
  }
};

// ===== COMPONENTE DE TABELA REUTILIZÁVEL =====
interface UserTableProps {
  title: string;
  users: any[];
  type: "alunos" | "professores" | "pais";
}

const UserTable = ({ title, users, type }: UserTableProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            {type === "alunos" && <TableHead>Pais/Responsáveis</TableHead>}
            {(type === "professores" || type === "pais") && <TableHead>Email</TableHead>}
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              
              {type === "alunos" && (
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {user.parents ? `${user.parents.length} responsável(eis)` : "Não informado"}
                  </span>
                </TableCell>
              )}
              
              {(type === "professores" || type === "pais") && (
                <TableCell>{user.email}</TableCell>
              )}
              
              <TableCell>
                <Badge variant={user.status === "active" ? "outline" : "destructive"}>
                  {user.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum usuário encontrado
        </div>
      )}
    </>
  );
};

// ===== COMPONENTE ESPECÍFICO PARA ALUNOS =====
interface StudentTableProps {
  students: Student[];
  parents: Parent[];
}

const StudentTable = ({ students, parents }: StudentTableProps) => {
  // Função para encontrar os nomes dos pais baseado nos IDs
  const getParentNames = (parentIds: string[]): string => {
    const parentNames = parentIds.map(parentId => {
      const parent = parents.find(p => p.id === parentId);
      return parent ? parent.name : "Pai não encontrado";
    });
    return parentNames.join(", ");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Alunos</h2>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Aluno
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Pais/Responsáveis</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {student.parents && student.parents.length > 0 ? (
                    getParentNames(student.parents).split(", ").map((parentName, index) => (
                      <span key={index} className="text-sm text-muted-foreground">
                        {parentName}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Não informado</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={student.status === "active" ? "outline" : "destructive"}>
                  {student.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {students.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum aluno encontrado
        </div>
      )}
    </>
  );
};

// ===== COMPONENTE DE CONFIGURAÇÕES =====
interface SystemSettingsProps {
  settings: AdminState["systemSettings"];
  onSettingsUpdate: (settings: Partial<AdminState["systemSettings"]>) => void;
  onBack: () => void;
}

const SystemSettings = ({ settings, onSettingsUpdate, onBack }: SystemSettingsProps) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsUpdate(formData);
    onBack();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="flex items-center gap-3 mb-8">
        <Button variant="ghost" onClick={onBack}>
          <MoveLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>
      
      <Card>
        <CardHeader>
          <SettingsIcon className="h-5 w-5 text-primary mb-2" />
          <span className="font-semibold">Preferências Gerais</span>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Sistema</label>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={formData.systemName}
                onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email de contato</label>
              <input
                type="email"
                className="border rounded px-3 py-2 w-full"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tema padrão</label>
              <select 
                className="border rounded px-3 py-2 w-full"
                value={formData.defaultTheme}
                onChange={(e) => setFormData({ ...formData, defaultTheme: e.target.value })}
              >
                <option value="system">Automático</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>
            <Button type="submit" className="mt-4">
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== COMPONENTE DE NAVEGAÇÃO =====
interface NavigationMenuProps {
  currentMenu: MenuType;
  onMenuChange: (menu: MenuType) => void;
}

const NavigationMenu = ({ currentMenu, onMenuChange }: NavigationMenuProps) => {
  const menuItems = [
    { id: "alunos" as MenuType, label: "Alunos", icon: Users },
    { id: "professores" as MenuType, label: "Professores", icon: UserIcon },
    { id: "pais" as MenuType, label: "Pais", icon: UserPlus }
  ];

  return (
    <nav className="w-48 flex flex-col gap-2 items-center">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={currentMenu === item.id ? "default" : "outline"}
          className="justify-center w-full"
          onClick={() => onMenuChange(item.id)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </nav>
  );
};

// ===== COMPONENTE PRINCIPAL =====
export default function AdminPage({ onExit }: AdminPageProps) {
  const [state, dispatch] = useReducer(adminReducer, initialAdminState);

  // Handler para mudar a visualização
  const setCurrentView = (view: AdminState["currentView"]) => {
    dispatch({ type: "SET_VIEW", payload: view });
  };

  // Handler para atualizar configurações
  const handleSettingsUpdate = (newSettings: Partial<AdminState["systemSettings"]>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: newSettings });
  };

  // Se estiver na tela de configurações
  if (state.currentView === "settings") {
    return (
      <SystemSettings
        settings={state.systemSettings}
        onSettingsUpdate={handleSettingsUpdate}
        onBack={() => setCurrentView("alunos")}
      />
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Avatar>
            <UserIcon className="h-6 w-6 text-primary" />
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Painel do Administrador</h1>
            <span className="text-muted-foreground text-sm">
              {state.systemSettings.systemName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={() => setCurrentView("settings")}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            Configurações
          </Button>
          <Button variant="ghost" onClick={onExit}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 justify-center items-start gap-8">
        <NavigationMenu
          currentMenu={state.currentView as MenuType}
          onMenuChange={(menu) => setCurrentView(menu)}
        />

        <Separator orientation="vertical" className="mx-8 h-64" />

        <section className="flex-1">
          {state.currentView === "alunos" && (
            <StudentTable
              students={state.students}
              parents={state.parents}
            />
          )}
          
          {state.currentView === "professores" && (
            <UserTable
              title="Lista de Professores"
              users={state.teachers}
              type="professores"
            />
          )}
          
          {state.currentView === "pais" && (
            <UserTable
              title="Lista de Pais"
              users={state.parents}
              type="pais"
            />
          )}
        </section>
      </div>
    </div>
  );
}