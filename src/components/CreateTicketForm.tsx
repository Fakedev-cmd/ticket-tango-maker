
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTicketStore } from "@/stores/ticketStore";
import { toast } from "@/hooks/use-toast";

interface CreateTicketFormProps {
  onSuccess: () => void;
}

export const CreateTicketForm = ({ onSuccess }: CreateTicketFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addTicket } = useTicketStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category.trim()) {
      toast({
        title: "Errore",
        description: "Tutti i campi sono obbligatori",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      addTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "open",
        category: category.trim(),
        createdBy: "Utente Corrente", // In un'app reale, questo sarebbe l'utente autenticato
      });

      toast({
        title: "Successo!",
        description: "Ticket creato con successo",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("");
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante la creazione del ticket",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Crea Nuovo Ticket</CardTitle>
        <CardDescription>
          Compila il form per creare un nuovo ticket di supporto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo *</Label>
            <Input
              id="title"
              placeholder="Inserisci il titolo del ticket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Input
              id="category"
              placeholder="es. Tecnico, Amministrativo, Generale"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priorità</Label>
            <Select value={priority} onValueChange={(value: "low" | "medium" | "high" | "critical") => setPriority(value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Seleziona la priorità" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="low">🟢 Bassa</SelectItem>
                <SelectItem value="medium">🟡 Media</SelectItem>
                <SelectItem value="high">🟠 Alta</SelectItem>
                <SelectItem value="critical">🔴 Critica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione *</Label>
            <Textarea
              id="description"
              placeholder="Descrivi il problema o la richiesta in dettaglio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? "Creazione in corso..." : "Crea Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
