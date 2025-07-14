import { Book } from '../types/models';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 truncate">{book.name}</h3>
        <span className="text-lg font-bold text-green-600">${book.price}</span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
          {book.categoryName || 'Uncategorized'}
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(book)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 