import { FormEvent, useMemo, useState } from "react";
import { useInventory } from "./hooks/useInventory";
import "./App.css";

type FormState = {
  name: string;
  quantity: string;
  description: string;
  location: string;
};

const initialForm: FormState = {
  name: "",
  quantity: "1",
  description: "",
  location: "",
};

function App() {
  const { items, status, error, addItem, reload } = useInventory();
  const [form, setForm] = useState<FormState>(initialForm);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setFeedback("Please provide an inventory name.");
      return;
    }

    const quantityValue = Number(form.quantity);
    if (Number.isNaN(quantityValue) || quantityValue <= 0) {
      setFeedback("Quantity must be a positive number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addItem({
        name: trimmedName,
        quantity: quantityValue,
        description: form.description.trim() || undefined,
        location: form.location.trim() || undefined,
      });
      setFeedback("Inventory saved for HR tracking.");
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      setFeedback("Unable to save right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">HR Inventory Desk</p>
        <h1>Log equipment and stock without logins</h1>
        <p>
          Designed for HR-run procurement and asset checks inside the IT department. Use the form
          below to add equipment, bump quantities, and monitor current stock.
        </p>
      </header>

      <main className="content-grid">
        <section className="inventory-form">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Add inventory</p>
              <h2>New record</h2>
            </div>
            <p className="status-text" aria-live="polite">
              {status === "loading" ? "Syncing with backend..." : "Backend ready."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="form-stack">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Laptop, Monitor, etc."
              />
            </label>

            <label>
              Quantity
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                type="number"
                min={1}
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Optional notes for HR"
              />
            </label>

            <label>
              Location / custodian
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Floor, room, or owner"
              />
            </label>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting || status === "loading"}>
                {isSubmitting ? "Saving…" : "Save inventory"}
              </button>
              <button type="button" onClick={reload} className="ghost">
                Refresh list
              </button>
            </div>
            {feedback && (
              <p className="feedback" aria-live="polite">
                {feedback}
              </p>
            )}
          </form>
        </section>

        <section className="inventory-list">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Current stock</p>
              <h2>Inventory records</h2>
            </div>
            <p className="small-text" aria-live="polite">
              {error
                ? "Unable to fetch inventory right now." : items.length === 0 ? "No items yet" : "Updated just now"}
            </p>
          </div>

          {items.length === 0 ? (
            <p className="placeholder">No inventory tracked yet. Add an item to get started.</p>
          ) : (
            <div className="inventory-grid">
              {sortedItems.map((item) => (
                <article key={item.id} className="inventory-card">
                  <div className="inventory-card__header">
                    <h3>{item.name}</h3>
                    <span className="quantity-badge">Qty {item.quantity}</span>
                  </div>
                  {item.description && <p className="description">{item.description}</p>}
                  <p className="meta">{item.location ?? "Location not set"}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
