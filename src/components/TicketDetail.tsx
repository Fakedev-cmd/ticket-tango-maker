
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useTicketStore, Ticket } from "@/stores/ticketStore";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface TicketDetailProps {
  ticketId: string;
}

export const TicketDetail = ({ ticketId }: TicketDetailProps) => {
  const { getTicketById, updateTicket } = useTicketStore();
  const ticket = getTicketById(ticketId);
  
  const [status, setStatus] = useState<Ticket['status']>(ticket?.status || "open");
  const [priority, setPriority] = useState<Ticket['priority']>(ticket?.priority || "medium");
  const [notes, setNotes] = useState("");

  if (!ticket) {
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-12 text-center">
          <p className="text-slate-500 text-lg">Ticket non trovato</p>
        </CardContent>
      </Card>
    );
  }

  const handleStatusUpdate = () => {
    updateTicket(ticket.id, { status, priority });
    toast({
      title: "Aggiornamento completato",
      description: "Il ticket è stato aggiornato con successo",
    });
  };

  const handleAddNote = () => {
    if (!notes.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci una nota prima di salvare",
        variant: "destructive",
      });
      return;
    }

    // In un'applicazione reale, qui salveresti la nota nel database
    setNotes("");
    toast({
      title: "Nota aggiunta",
      description: "La nota è stata aggiunta al ticket",
    });
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case "open": return "destructive";
      case "in-progress": return "default";
      case "resolved": return "secondary";
      case "closed": return "outline";
      default: return "outline";
    }
  };

  const getStatusText = (status: Ticket['status']) => {
    switch (status) {
      case "open": return "Aperto";
      case "in-progress": return "In Corso";
      case "resolved": return "Risolto";
      case "closed": return "Chiuso";
      default: return status;
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case "low": return "🟢";
      case "medium": return "🟡";
      case "high": return "🟠";
      case "critical": return "🔴";
      default: return "⚪";
    }
  };

  const getPriorityText = (priority: Ticket['priority']) => {
    switch (priority) {
      case "low": return "Bassa";
      case "medium": return "Media";
      case "high": return "Alta";
      case "critical": return "Critica";
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-slate-800 mb-2">{ticket.title}</CardTitle>
              <CardDescription className="text-slate-600">
                Ticket #{ticket.id.slice(0, 8)} • Creato il {format(new Date(ticket.createdAt), "dd MMM yyyy 'alle' HH:mm", { locale: it })}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={getStatusColor(ticket.status)} className="text-sm">
                {getStatusText(ticket.status)}
              </Badge>
              <div className="flex items-center gap-1">
                <span className="text-lg">{getPriorityColor(ticket.priority)}</span>
                <span className="text-sm text-slate-600">{getPriorityText(ticket.priority)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Descrizione</h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">{ticket.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Informazioni</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Categoria:</span>
                  <span className="font-medium">{ticket.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Creato da:</span>
                  <span className="font-medium">{ticket.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ultima modifica:</span>
                  <span className="font-medium">{format(new Date(ticket.updatedAt), "dd MMM yyyy HH:mm", { locale: it })}</span>
                </div>
                {ticket.assignedTo && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assegnato a:</span>
                    <span className="font-medium">{ticket.assignedTo}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Aggiorna Stato</h4>
              <div className="space-y-3">
                <Select value={status} onValueChange={(value: Ticket['status']) => setStatus(value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="open">Aperto</SelectItem>
                    <SelectItem value="in-progress">In Corso</SelectItem>
                    <SelectItem value="resolved">Risolto</SelectItem>
                    <SelectItem value="closed">Chiuso</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priority} onValueChange={(value: Ticket['priority']) => setPriority(value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="low">🟢 Bassa</SelectItem>
                    <SelectItem value="medium">🟡 Media</SelectItem>
                    <SelectItem value="high">🟠 Alta</SelectItem>
                    <SelectItem value="critical">🔴 Critica</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleStatusUpdate} 
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                >
                  Aggiorna Ticket
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Aggiungi Nota</h4>
            <div className="space-y-3">
              <Textarea
                placeholder="Scrivi una nota o un aggiornamento per questo ticket..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                onClick={handleAddNote}
                variant="outline" 
                className="hover:bg-slate-50 transition-colors duration-300"
              >
                Aggiungi Nota
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
