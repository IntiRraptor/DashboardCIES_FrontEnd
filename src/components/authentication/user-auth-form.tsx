"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { credentials } from "@/lib/auth-credentials";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoadingLogin, setIsLoadingLogin] = React.useState<boolean>(false);
  const [isLoadingForgotPassword, setIsLoadingForgotPassword] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoadingLogin(true);
    setError(null);

    const matchedCredential = credentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (matchedCredential) {
      // Autenticación exitosa
      setTimeout(() => {
        setIsLoadingLogin(false);
        router.push("/dashboard/");
      }, 2000);
    } else {
      // Autenticación fallida
      setTimeout(() => {
        setIsLoadingLogin(false);
        setError("Correo electrónico o contraseña incorrectos");
      }, 2000);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              placeholder="nombre@ejemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoadingLogin}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Contraseña
            </Label>
            <Input
              id="password"
              placeholder="Contraseña"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoadingLogin}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}
          <Button disabled={isLoadingLogin}>
            {isLoadingLogin && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Sesión
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoadingForgotPassword}>
        ¿Olvidaste tu contraseña?
      </Button>
    </div>
  );
}
