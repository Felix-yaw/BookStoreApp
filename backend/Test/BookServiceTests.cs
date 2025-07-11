using Application.Dtos;
using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Test
{
    [TestClass]
    public class BookServiceTests
    {
        private Mock<IBookRepository> _bookRepo;
        private Mock<ICategoryRepository> _categoryRepo;
        private BookService _service;

        [TestInitialize]
        public void Setup()
        {
            _bookRepo = new Mock<IBookRepository>();
            _categoryRepo = new Mock<ICategoryRepository>();
            _service = new BookService(_bookRepo.Object, _categoryRepo.Object);
        }

        [TestMethod]
        public async Task GetAllAsync_ReturnsBooks()
        {
            var books = new List<Book>
            {
                new Book { Id = 1, Name = "Book1", Description = "Desc1", Price = 10, CategoryId = 1, Category = new Category { Id = 1, Name = "Fiction" } },
                new Book { Id = 2, Name = "Book2", Description = "Desc2", Price = 15, CategoryId = 2, Category = new Category { Id = 2, Name = "Science" } }
            };
            _bookRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(books);

            var result = await _service.GetAllAsync();

            Assert.IsTrue(result.Success);
            Assert.AreEqual(2, result.Data.Count());
            Assert.AreEqual("Book1", result.Data.First().Name);
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsBook_WhenExists()
        {
            var book = new Book { Id = 1, Name = "Book1", Description = "Desc1", Price = 10, CategoryId = 1, Category = new Category { Id = 1, Name = "Fiction" } };
            _bookRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(book);

            var result = await _service.GetByIdAsync(1);

            Assert.IsTrue(result.Success);
            Assert.AreEqual("Book1", result.Data.Name);
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsFailure_WhenNotExists()
        {
            _bookRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync((Book)null);

            var result = await _service.GetByIdAsync(1);

            Assert.IsFalse(result.Success);
            Assert.IsNull(result.Data);
        }

        [TestMethod]
        public async Task AddAsync_ReturnsSuccess_WhenCategoryExists()
        {
            var dto = new BookDto { Name = "Book1", Description = "Desc1", Price = 10, CategoryId = 1 };
            var category = new Category { Id = 1, Name = "Fiction" };
            _categoryRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(category);
            _bookRepo.Setup(repo => repo.AddAsync(It.IsAny<Book>())).Returns(Task.CompletedTask);

            var result = await _service.AddAsync(dto);

            Assert.IsTrue(result.Success);
            Assert.AreEqual("Book1", result.Data.Name);
            Assert.AreEqual("Fiction", result.Data.CategoryName);
        }

        [TestMethod]
        public async Task AddAsync_ReturnsFailure_WhenCategoryDoesNotExist()
        {
            var dto = new BookDto { Name = "Book1", Description = "Desc1", Price = 10, CategoryId = 99 };
            _categoryRepo.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((Category)null);

            var result = await _service.AddAsync(dto);

            Assert.IsFalse(result.Success);
            Assert.IsNull(result.Data);
        }

        [TestMethod]
        public async Task UpdateAsync_ReturnsSuccess_WhenBookAndCategoryExist()
        {
            var dto = new BookDto { Id = 1, Name = "Book1Updated", Description = "Desc1Updated", Price = 15, CategoryId = 2 };
        }
    }
}
