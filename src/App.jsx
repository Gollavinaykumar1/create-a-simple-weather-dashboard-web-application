import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiPlus } from 'react-icons/hi';
import { FiCheckCircle } from 'react-icons/fi';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import 'tailwindcss/base.css';
import 'tailwindcss/components.css';
import 'tailwindcss/utilities.css';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const App = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'To Do', priority: 'High', assignee: 'John Doe' },
    { id: 2, title: 'In Progress', priority: 'Medium', assignee: 'Jane Doe' },
    { id: 3, title: 'Review', priority: 'Low', assignee: 'Bob Smith' },
    { id: 4, title: 'Done', priority: 'High', assignee: 'Alice Johnson' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [draggingCard, setDraggingCard] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const handleDragStart = (event, card) => {
    setDraggingCard(card);
  };

  const handleDrop = (event, column) => {
    event.preventDefault();
    if (draggingCard) {
      const updatedCards = cards.map((card) => {
        if (card.id === draggingCard.id) {
          return { ...card, column };
        }
        return card;
      });
      setCards(updatedCards);
      setDraggingCard(null);
    }
  };

  const handleAddCard = useCallback(async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/cards`, data);
      setCards([...cards, response.data]);
      reset();
      setModalOpen(false);
      toast.success('Card added successfully!');
    } catch (error) {
      toast.error('Error adding card!');
    }
  }, [cards, reset]);

  return (
    <HashRouter>
      <div className="h-screen flex flex-col">
        <header className="bg-blue-500 text-white p-4">
          <h1 className="text-3xl font-bold">Weather Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Kanban Board</h2>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setModalOpen(true)}
            >
              <HiPlus className="mr-2" /> Add Card
            </button>
          </div>
          <div className="flex justify-between">
            <div
              className={clsx(
                'bg-red-200 p-4 w-1/4',
                'flex flex-col justify-between'
              )}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, 'To Do')}
            >
              <h3 className="text-lg font-bold text-red-500">To Do</h3>
              <span className="text-sm">{cards.filter((card) => card.column === 'To Do').length}</span>
              {cards
                .filter((card) => card.column === 'To Do')
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, card)}
                    className="bg-white p-2 mb-2 shadow-sm"
                  >
                    <h4 className="text-sm font-bold">{card.title}</h4>
                    <span className="text-xs">{card.priority}</span>
                    <span className="text-xs">{card.assignee}</span>
                  </div>
                ))}
            </div>
            <div
              className={clsx(
                'bg-yellow-200 p-4 w-1/4',
                'flex flex-col justify-between'
              )}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, 'In Progress')}
            >
              <h3 className="text-lg font-bold text-yellow-500">In Progress</h3>
              <span className="text-sm">{cards.filter((card) => card.column === 'In Progress').length}</span>
              {cards
                .filter((card) => card.column === 'In Progress')
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, card)}
                    className="bg-white p-2 mb-2 shadow-sm"
                  >
                    <h4 className="text-sm font-bold">{card.title}</h4>
                    <span className="text-xs">{card.priority}</span>
                    <span className="text-xs">{card.assignee}</span>
                  </div>
                ))}
            </div>
            <div
              className={clsx(
                'bg-blue-200 p-4 w-1/4',
                'flex flex-col justify-between'
              )}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, 'Review')}
            >
              <h3 className="text-lg font-bold text-blue-500">Review</h3>
              <span className="text-sm">{cards.filter((card) => card.column === 'Review').length}</span>
              {cards
                .filter((card) => card.column === 'Review')
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, card)}
                    className="bg-white p-2 mb-2 shadow-sm"
                  >
                    <h4 className="text-sm font-bold">{card.title}</h4>
                    <span className="text-xs">{card.priority}</span>
                    <span className="text-xs">{card.assignee}</span>
                  </div>
                ))}
            </div>
            <div
              className={clsx(
                'bg-green-200 p-4 w-1/4',
                'flex flex-col justify-between'
              )}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, 'Done')}
            >
              <h3 className="text-lg font-bold text-green-500">Done</h3>
              <span className="text-sm">{cards.filter((card) => card.column === 'Done').length}</span>
              {cards
                .filter((card) => card.column === 'Done')
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, card)}
                    className="bg-white p-2 mb-2 shadow-sm"
                  >
                    <h4 className="text-sm font-bold">{card.title}</h4>
                    <span className="text-xs">{card.priority}</span>
                    <span className="text-xs">{card.assignee}</span>
                  </div>
                ))}
            </div>
          </div>
        </main>
        {modalOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white p-4 shadow-sm"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="text-lg font-bold">Add Card</h2>
              <form onSubmit={handleSubmit(handleAddCard)}>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="block w-full p-2 border border-gray-400 rounded"
                    {...register('title')}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="block w-full p-2 border border-gray-400 rounded"
                    {...register('priority')}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" htmlFor="assignee">
                    Assignee
                  </label>
                  <input
                    type="text"
                    id="assignee"
                    className="block w-full p-2 border border-gray-400 rounded"
                    {...register('assignee')}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FiCheckCircle className="mr-2" /> Add
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </HashRouter>
  );
};

export default App;