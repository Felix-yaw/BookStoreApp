using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        private readonly ICategoryRepository _categoryRepository;

        public BookService(IBookRepository bookRepository, ICategoryRepository categoryRepository)
        {
            _bookRepository = bookRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<Result<IEnumerable<BookDto>>> GetAllAsync()
        {
            var books = await _bookRepository.GetAllAsync();
            var bookDtos = books.Select(b => new BookDto
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                Price = b.Price,
                CategoryId = b.CategoryId,
                CategoryName = b.Category?.Name
            });
            return Result<IEnumerable<BookDto>>.SuccessResult(bookDtos, "Books retrieved successfully.");
        }

        public async Task<Result<BookDto>> GetByIdAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
                return Result<BookDto>.FailureResult("Book not found.");

            var bookDto = new BookDto
            {
                Id = book.Id,
                Name = book.Name,
                Description = book.Description,
                Price = book.Price,
                CategoryId = book.CategoryId,
                CategoryName = book.Category?.Name
            };

            return Result<BookDto>.SuccessResult(bookDto, "Book retrieved successfully.");
        }

        public async Task<Result<BookDto>> AddAsync(BookDto bookDto)
        {
            var category = await _categoryRepository.GetByIdAsync(bookDto.CategoryId);
            if (category == null)
                return Result<BookDto>.FailureResult("Category does not exist.");

            var book = new Book
            {
                Name = bookDto.Name,
                Description = bookDto.Description,
                Price = bookDto.Price,
                CategoryId = bookDto.CategoryId
            };

            await _bookRepository.AddAsync(book);

            var resultDto = new BookDto
            {
                Id = book.Id,
                Name = book.Name,
                Description = book.Description,
                Price = book.Price,
                CategoryId = book.CategoryId,
                CategoryName = category.Name
            };

            return Result<BookDto>.SuccessResult(resultDto, "Book added successfully.");
        }

        public async Task<Result<bool>> UpdateAsync(BookDto bookDto)
        {
            var book = await _bookRepository.GetByIdAsync(bookDto.Id);
            if (book == null)
                return Result<bool>.FailureResult("Book not found.");

            var category = await _categoryRepository.GetByIdAsync(bookDto.CategoryId);
            if (category == null)
                return Result<bool>.FailureResult("Category does not exist.");

            book.Name = bookDto.Name;
            book.Description = bookDto.Description;
            book.Price = bookDto.Price;
            book.CategoryId = bookDto.CategoryId;

            await _bookRepository.UpdateAsync(book);
            return Result<bool>.SuccessResult(true, "Book updated successfully.");
        }

        public async Task<Result<bool>> DeleteAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
                return Result<bool>.FailureResult("Book not found.");

            await _bookRepository.DeleteAsync(id);
            return Result<bool>.SuccessResult(true, "Book deleted successfully.");
        }
    }
}
