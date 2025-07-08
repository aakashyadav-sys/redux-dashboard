import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, MoreHorizontal, Calendar, User, Flag, Tag, Edit3, Trash2, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { moveCard, addCard, updateCard, deleteCard, addColumn } from '../store/kanbanSlice';
import { KanbanCard, KanbanColumn } from '../store/kanbanSlice';
import Modal from './Modal';
import KanbanCardForm from './KanbanCardForm';

const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { columns } = useAppSelector(state => state.kanban);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<{ card: KanbanCard; columnId: string } | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(moveCard({
      cardId: draggableId,
      sourceColumnId: source.droppableId,
      destinationColumnId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index
    }));
  };

  const handleAddCard = (columnId: string) => {
    setSelectedColumn(columnId);
    setIsAddCardModalOpen(true);
  };

  const handleEditCard = (card: KanbanCard, columnId: string) => {
    setEditingCard({ card, columnId });
    setIsEditCardModalOpen(true);
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      dispatch(deleteCard({ cardId, columnId }));
    }
  };

  const handleCardSubmit = (cardData: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedColumn) {
      dispatch(addCard({ columnId: selectedColumn, card: cardData }));
      setIsAddCardModalOpen(false);
      setSelectedColumn(null);
    }
  };

  const handleCardUpdate = (cardData: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCard) {
      dispatch(updateCard({
        columnId: editingCard.columnId,
        cardId: editingCard.card.id,
        updates: cardData
      }));
      setIsEditCardModalOpen(false);
      setEditingCard(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const totalCards = columns.reduce((total, column) => total + column.cards.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg mr-3">
              <Eye className="h-6 w-6 text-white" />
            </div>
            Kanban Board
          </h2>
          <p className="text-gray-600 mt-1">Manage tasks with drag-and-drop workflow</p>
        </div>
        
        <button
          onClick={() => {/* Add column functionality */}}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="mr-2" />
          Add Column
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900">{totalCards}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {columns.find(col => col.id === 'in-progress')?.cards.length || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {columns.find(col => col.id === 'done')?.cards.length || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Flag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Columns</p>
              <p className="text-2xl font-bold text-purple-600">{columns.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="p-6">
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-gray-50 rounded-lg p-4 min-h-[500px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent'
                        }`}
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: column.color }}
                            />
                            <h3 className="font-semibold text-gray-900">{column.title}</h3>
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {column.cards.length}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleAddCard(column.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                              title="Add card"
                            >
                              <Plus size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Cards */}
                        <div className="space-y-3">
                          {column.cards.map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                                    snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                  }`}
                                >
                                  <div className="space-y-3">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between">
                                      <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                        {card.title}
                                      </h4>
                                      <div className="flex items-center space-x-1 ml-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditCard(card, column.id);
                                          }}
                                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                          title="Edit card"
                                        >
                                          <Edit3 size={12} />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCard(card.id, column.id);
                                          }}
                                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                                          title="Delete card"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Description */}
                                    {card.description && (
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {card.description}
                                      </p>
                                    )}

                                    {/* Tags */}
                                    {card.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {card.tags.map((tag, tagIndex) => (
                                          <span
                                            key={tagIndex}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* Card Footer */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        {/* Priority */}
                                        <div
                                          className={`w-2 h-2 rounded-full ${getPriorityColor(card.priority)}`}
                                          title={`${card.priority} Priority`}
                                        />
                                        
                                        {/* Assignee */}
                                        {card.assignee && (
                                          <div className="flex items-center text-xs text-gray-600">
                                            <User size={12} className="mr-1" />
                                            <span className="truncate max-w-[80px]">{card.assignee}</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Due Date */}
                                      {card.dueDate && (
                                        <div className="flex items-center text-xs text-gray-600">
                                          <Calendar size={12} className="mr-1" />
                                          <span>{formatDate(card.dueDate)}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>

                        {/* Add Card Button */}
                        <button
                          onClick={() => handleAddCard(column.id)}
                          className="w-full mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                        >
                          <Plus size={16} className="inline mr-2" />
                          Add a card
                        </button>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* Add Card Modal */}
      <Modal
        isOpen={isAddCardModalOpen}
        onClose={() => {
          setIsAddCardModalOpen(false);
          setSelectedColumn(null);
        }}
        title="Add New Card"
      >
        <KanbanCardForm
          onSubmit={handleCardSubmit}
          onCancel={() => {
            setIsAddCardModalOpen(false);
            setSelectedColumn(null);
          }}
        />
      </Modal>

      {/* Edit Card Modal */}
      <Modal
        isOpen={isEditCardModalOpen}
        onClose={() => {
          setIsEditCardModalOpen(false);
          setEditingCard(null);
        }}
        title="Edit Card"
      >
        <KanbanCardForm
          onSubmit={handleCardUpdate}
          onCancel={() => {
            setIsEditCardModalOpen(false);
            setEditingCard(null);
          }}
          initialData={editingCard?.card}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default KanbanBoard;