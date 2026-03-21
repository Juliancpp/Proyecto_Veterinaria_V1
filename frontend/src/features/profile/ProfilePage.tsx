import { User, Mail, Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Mi Perfil</h1>

      <Card className="mt-6 border-border/50">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user?.name || "Usuario"}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role || "user"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Correo electrónico</p>
                <p className="text-sm font-medium text-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Rol</p>
                <p className="text-sm font-medium capitalize text-foreground">{user?.role || "user"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
