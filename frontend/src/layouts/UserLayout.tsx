import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { PawPrint, MapPin, Hospital, User, LogOut, Heart, HeartHandshake } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";

const userLinks = [
  { to: "/app/pets", label: "Adoptar", icon: PawPrint },
  { to: "/app/likes", label: "Mis Favoritos", icon: HeartHandshake },
  { to: "/app/report", label: "Reportar Mascota", icon: MapPin },
  { to: "/app/clinics", label: "Clínicas", icon: Hospital },
  { to: "/app/profile", label: "Perfil", icon: User },
];

export const UserLayout = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="flex items-center gap-2 px-4 py-4">
              <Heart className="h-6 w-6 shrink-0 text-primary" fill="hsl(var(--primary))" />
              <span className="font-display text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden">
                PatitasHome
              </span>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userLinks.map((link) => (
                    <SidebarMenuItem key={link.to}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={link.to}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                          activeClassName="bg-primary/10 text-primary font-medium"
                        >
                          <link.icon className="h-5 w-5 shrink-0" />
                          <span>{link.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span>Salir</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center border-b border-border/50 bg-background/80 px-4 backdrop-blur-sm">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
