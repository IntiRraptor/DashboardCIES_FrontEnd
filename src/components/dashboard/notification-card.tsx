"use client";

import { CheckSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function NotificationCard() {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-sm font-medium flex items-center">
          <CheckSquare className="mr-2 h-4 w-4 text-primary" />
          Notificaciones Pendientes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="text-3xl font-bold mb-4">4</div>
        <div className="space-y-2 flex-grow flex flex-col">
          <Button variant="outline" className="w-full justify-start">
            Regional La Paz
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Regional El Alto
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Regional La Paz
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Regional El Alto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
