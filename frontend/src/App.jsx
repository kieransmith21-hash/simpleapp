import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch greeting message
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error fetching message:', err))

    // Fetch items
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching items:', err)
        setLoading(false)
      })
  }, [])

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItem.title.trim()) return

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })
      const data = await response.json()
      setItems([...items, data])
      setNewItem({ title: '', description: '' })
    } catch (err) {
      console.error('Error adding item:', err)
    }
  }

  return (
    <div className="container">
      <h1>Simple Web App</h1>
      
      <div className="card">
        <h2>Backend Connection</h2>
        <p className="message">{message || 'Connecting...'}</p>
      </div>

      <div className="card">
        <h2>Items</h2>
        
        <form onSubmit={handleAddItem} className="form">
          <input
            type="text"
            placeholder="Item title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Item description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <button type="submit">Add Item</button>
        </form>

        {loading ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>No items yet</p>
        ) : (
          <ul className="items-list">
            {items.map(item => (
              <li key={item.id} className="item">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
