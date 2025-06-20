import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// --- Interfacce per la Tipizzazione ---

interface Product {
  id: string;
  name: string;
}

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
}

const CreateTicketDialog = ({ open, onOpenChange, onTicketCreated }: CreateTicketDialogProps) => {
  const { user } = useAuth(); // 'user' dovrebbe essere già tipizzato dal tuo AuthContext
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<'Account' | 'Orders' | 'Other' | ''>('');
  const [productId, setProductId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      fetchProducts();
      // Reset form on dialog open if it's not being done elsewhere
      setTitle('');
      setDescription('');
      setCategory('');
      setProductId('');
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('available', true)
        .order('name');

      if (error) throw error;
      setProducts(data as Product[] || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Errore",
        description: `Impossibile caricare i prodotti: ${error.message || 'Riprova.'}`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => { // Tipizzato l'evento
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      toast({
        title: "Errore",
        description: "Per favore, compila tutti i campi richiesti.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere loggato per creare un ticket.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const currentUserId = user.id; // Usa l'ID utente di Supabase Auth

      // Assicurati che l'utente esista nella tabella 'users'
      const userData = {
        id: currentUserId, // Usa l'ID utente di Supabase Auth
        username: user.username || 'Cliente', // Fallback
        email: user.email || `${currentUserId}@local.app`, // Fallback
        role: user.role || 'customer' // Fallback
      };

      // Inserisci o aggiorna il record utente (ignora i conflitti se l'utente esiste già)
      const { error: userUpsertError } = await supabase
        .from('users')
        .upsert(userData, {
          onConflict: 'id',
          ignoreDuplicates: true
        });

      if (userUpsertError) {
        console.error('Error upserting user:', userUpsertError);
        // Potresti voler mostrare un toast o lanciare un errore qui se l'upsert dell'utente è critico
      }

      // Crea il ticket
      const ticketData = {
        id: crypto.randomUUID(), // Genera un nuovo UUID per il ticket
        user_id: currentUserId, // ID dell'utente loggato
        title: title.trim(),
        description: description.trim(),
        category: category,
        product_id: productId || null,
        status: 'open' as const, // 'as const' assicura che il tipo sia 'open' e non solo 'string'
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: ticketResult, error: ticketError } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select('id')
        .single();

      if (ticketError) {
        console.error('Ticket creation error:', ticketError);
        throw ticketError;
      }

      toast({
        title: "Successo",
        description: "Il tuo ticket è stato creato con successo.",
      });

      // Reset form e chiudi dialog
      setTitle('');
      setDescription('');
      setCategory('');
      setProductId('');
      onOpenChange(false);
      onTicketCreated(); // Chiama la funzione per aggiornare la lista dei ticket
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Errore",
        description: `Impossibile creare il ticket: ${error.message || 'Riprova.'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    // Il controllo sui valori specifici è già gestito dalla tipizzazione di `setCategory` se `value` è inferito correttamente
    // Ma un controllo esplicito è più sicuro per input non tipizzati
    if (['Account', 'Orders', 'Other', ''].includes(value)) {
      setCategory(value as 'Account' | 'Orders' | 'Other' | '');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/50 shadow-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl">Crea Ticket di Supporto</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Compila il modulo sottostante per creare un nuovo ticket di supporto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Breve descrizione del tuo problema"
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Seleziona una categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Account">Account</SelectItem>
                <SelectItem value="Orders">Ordini</SelectItem>
                <SelectItem value="Other">Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Prodotto Correlato (Opzionale)</Label>
            <Select value={productId} onValueChange={(value) => setProductId(value === 'none' ? '' : value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Seleziona un prodotto (opzionale)" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="none">Nessuno</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione dettagliata del tuo problema"
              className="bg-background/50 border-border/50 min-h-[120px]"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? 'Creazione...' : 'Crea Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;