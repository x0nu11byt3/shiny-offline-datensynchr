import React, { useState } from 'react';
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

// Initialize Dexie Database
const db = new Dexie('ShinyLocalDB');

db.version(1).stores({
  items: '++id, name, description', // Primary key and indexed properties
});

interface Struct {
  //id: number;
  name: string;
  description: string;
}

const ShinyOfflineDatensynchr = () => {

  //const [struct,setStruct] = useState({
  //  name:"",
  //  description:""
  //});

  const [struct, setStruct] = useState<Struct>({
      name: "",
      description: ""
  })

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Load items from Dexie using useLiveQuery hook
    const items = useLiveQuery(async () => {
    return await db.table('items').toArray();
  });

  const addItem = async () => {
    try {
      await db.table('items').add({ name, description });
      setStruct({
          ...struct,
          name: "",
          description: ""
      })
      //setName('');
      //setDescription('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id:any) => {
      try {
        await db.table('items').delete(id);
      } catch (error) {
        console.error('Error deleting item:', error)
      }
  }

  return (
    <React.Fragment>
      <h2>Add Item</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addItem}>Add</button>

      <h2>Items</h2>
      {items && items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.description}
              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found.</p>
      )}
    </React.Fragment>
  );
}

export default ShinyOfflineDatensynchr;
