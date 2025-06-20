
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTicketStore, Ticket } from "@/stores/ticketStore";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface TicketListProps {
  onTicketSelect: (ticketId: string) => void;
}

export const TicketList = ({ onTicketSelect }: TicketListProps) => {
  const { tickets } = useTicketStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

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
          <CardTitle>Filtri e Ricerca</CardTitle>
          <CardDescription>Filtra i ticket per stato, priorità o cerca per parole chiave</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Cerca ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Filtra per stato" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value="open">Aperti</SelectItem>
                  <SelectItem value="in-progress">In Corso</SelectItem>
                  <SelectItem value="resolved">Risolti</SelectItem>
                  <SelectItem value="closed">Chiusi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Filtra per priorità" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all">Tutte le priorità</SelectItem>
                  <SelectItem value="low">🟢 Bassa</SelectItem>
                  <SelectItem value="medium">🟡 Media</SelectItem>
                  <SelectItem value="high">🟠 Alta</SelectItem>
                  <SelectItem value="critical">🔴 Critica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            onClick={() => onTicketSelect(ticket.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{ticket.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>ID: #{ticket.id.slice(0, 8)}</span>
                    <span>Categoria: {ticket.category}</span>
                    <span>Creato: {format(new Date(ticket.createdAt), "dd MMM yyyy", { locale: it })}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge variant={getStatusColor(ticket.status)} className="whitespace-nowrap">
                    {getStatusText(ticket.status)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <span>{getPriorityColor(ticket.priority)}</span>
                    <span className="text-slate-600">{getPriorityText(ticket.priority)}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full hover:bg-slate-50 transition-colors duration-200">
                Visualizza Dettagli →
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {filteredTickets.length === 0 && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-12 text-center">
              <p className="text-slate-500 text-lg">Nessun ticket trovato con i filtri selezionati</p>
              <p className="text-slate-400 text-sm mt-2">Prova a modificare i filtri o creare un nuovo ticket</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
