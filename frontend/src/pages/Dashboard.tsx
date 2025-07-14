import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBooks, deleteBook, createBook, updateBook } from '../services/bookService';
import { Book, CreateBookRequest } from '../types/models';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import BookFormModal from '../components/BookFormModal';
import CategoryManager from '../components/CategoryManager';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'categories'>('books');
  const queryClient = useQueryClient();

  const { data: books = [], isLoading, error, refetch } = useQuery({
    queryKey: ['books'],
    queryFn: getAllBooks,
  });

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsModalOpen(false);
      setEditingBook(null);
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Book> }) => updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsModalOpen(false);
      setEditingBook(null);
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        toast.success('Book deleted successfully');
        refetch();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleFormSubmit = async (data: CreateBookRequest) => {
    if (editingBook) {
      await updateBookMutation.mutateAsync({ id: editingBook.id, data });
    } else {
      await createBookMutation.mutateAsync(data);
    }
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Books</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('books')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'books'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Books
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories
              </button>
            </nav>
          </div>
        </div>

        {/* Books Tab Content */}
        {activeTab === 'books' && (
          <>
            {/* Search and Add Book Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleAddBook}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                + Add Book
              </button>
            </div>

            {/* Books Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading books...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No books found' : 'No books available'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Add your first book to get started!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Categories Tab Content */}
        {activeTab === 'categories' && (
          <CategoryManager />
        )}
      </div>

      {/* Book Form Modal */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        book={editingBook}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
      />
    </div>
  );
} 