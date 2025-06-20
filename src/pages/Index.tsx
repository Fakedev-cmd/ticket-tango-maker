
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TicketPlus, TicketCheck, Tickets, TicketX } from "lucide-react";
import { CreateTicketForm } from "@/components/CreateTicketForm";
import { TicketList } from "@/components/TicketList";
import { TicketDetail } from "@/components/TicketDetail";
import { useTicketStore } from "@/stores/ticketStore";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { tickets } = useTicketStore();

  const openTickets = tickets.filter(t => t.status === "open").length;
  const inProgressTickets = tickets.filter(t => t.status === "in-progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved").length;
  const closedTickets = tickets.filter(t => t.status === "closed").length;

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveTab("detail");
  };

  const handleCreateTicket = () => {
    setActiveTab("create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Sistema di Gestione Ticket</h1>
          <p className="text-slate-600">Gestisci e monitora tutti i tuoi ticket in un unico posto</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Tickets className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <TicketCheck className="h-4 w-4" />
              I Miei Ticket
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <TicketPlus className="h-4 w-4" />
              Nuovo Ticket
            </TabsTrigger>
            <TabsTrigger value="detail" className="flex items-center gap-2" disabled={!selectedTicketId}>
              <TicketX className="h-4 w-4" />
              Dettaglio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Aperti</CardTitle>
                  <Tickets className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{openTickets}</div>
                  <p className="text-xs text-muted-foreground">In attesa di gestione</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Corso</CardTitle>
                  <TicketCheck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{inProgressTickets}</div>
                  <p className="text-xs text-muted-foreground">In lavorazione</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Risolti</CardTitle>
                  <TicketPlus className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
                  <p className="text-xs text-muted-foreground">Pronti per chiusura</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chiusi</CardTitle>
                  <TicketX className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{closedTickets}</div>
                  <p className="text-xs text-muted-foreground">Completati</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Azioni Rapide</CardTitle>
                  <CardDescription>Gestisci i tuoi ticket velocemente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleCreateTicket} className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                    <TicketPlus className="mr-2 h-4 w-4" />
                    Crea Nuovo Ticket
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("tickets")} className="w-full hover:bg-slate-50 transition-colors duration-300">
                    <Tickets className="mr-2 h-4 w-4" />
                    Visualizza Tutti i Ticket
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Ultimi Ticket</CardTitle>
                  <CardDescription>I ticket creati più di recente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tickets.slice(0, 3).map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer" onClick={() => handleTicketSelect(ticket.id)}>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground">#{ticket.id.slice(0, 8)}</p>
                        </div>
                        <Badge variant={ticket.status === "open" ? "destructive" : ticket.status === "in-progress" ? "default" : ticket.status === "resolved" ? "secondary" : "outline"}>
                          {ticket.status === "open" ? "Aperto" : ticket.status === "in-progress" ? "In Corso" : ticket.status === "resolved" ? "Risolto" : "Chiuso"}
                        </Badge>
                      </div>
                    ))}
                    {tickets.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">Nessun ticket trovato</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <TicketList onTicketSelect={handleTicketSelect} />
          </TabsContent>

          <TabsContent value="create">
            <CreateTicketForm onSuccess={() => setActiveTab("tickets")} />
          </TabsContent>

          <TabsContent value="detail">
            {selectedTicketId && <TicketDetail ticketId={selectedTicketId} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
