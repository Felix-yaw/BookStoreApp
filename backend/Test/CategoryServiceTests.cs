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
    public class CategoryServiceTests
    {
        private Mock<ICategoryRepository> _categoryRepo;
        private CategoryService _service;

        [TestInitialize]
        public void Setup()
        {
            _categoryRepo = new Mock<ICategoryRepository>();
            _service = new CategoryService(_categoryRepo.Object);
        }

        [TestMethod]
        public async Task GetAllAsync_ReturnsCategories()
        {
            var categories = new List<Category>
            {
                new Category { Id = 1, Name = "Fiction" },
                new Category { Id = 2, Name = "Science" }
            };
            _categoryRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(categories);

            var result = await _service.GetAllAsync();

            Assert.IsTrue(result.Success);
            Assert.AreEqual(2, result.Data.Count());
            Assert.AreEqual("Fiction", result.Data.First().Name);
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsCategory_WhenExists()
        {
            var category = new Category { Id = 1, Name = "Fiction" };
            _categoryRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(category);

            var result = await _service.GetByIdAsync(1);

            Assert.IsTrue(result.Success);
            Assert.AreEqual("Fiction", result.Data.Name);
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsFailure_WhenNotExists()
        {
            _categoryRepo.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((Category)null);

            var result = await _service.GetByIdAsync(99);

            Assert.IsFalse(result.Success);
            Assert.IsNull(result.Data);
        }

        [TestMethod]
        public async Task AddAsync_ReturnsSuccess()
        {
            var dto = new CategoryDto { Name = "Adventure" };
            _categoryRepo.Setup(repo => repo.AddAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);

            var result = await _service.AddAsync(dto);

            Assert.IsTrue(result.Success);
            Assert.AreEqual("Adventure", result.Data.Name);
        }

        [TestMethod]
        public async Task UpdateAsync_ReturnsSuccess_WhenCategoryExists()
        {
            var dto = new CategoryDto { Id = 1, Name = "Biography" };
            var category = new Category { Id = 1, Name = "Fiction" };
            _categoryRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(category);
            _categoryRepo.Setup(repo => repo.UpdateAsync(category)).Returns(Task.CompletedTask);

            var result = await _service.UpdateAsync(dto);

            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data);
        }

        [TestMethod]
        public async Task UpdateAsync_ReturnsFailure_WhenCategoryNotExists()
        {
            var dto = new CategoryDto { Id = 99, Name = "Poetry" };
            _categoryRepo.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((Category)null);

            var result = await _service.UpdateAsync(dto);

            Assert.IsFalse(result.Success);
        }

        [TestMethod]
        public async Task DeleteAsync_ReturnsSuccess_WhenCategoryExists()
        {
            var category = new Category { Id = 1, Name = "Fiction" };
            _categoryRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(category);
            _categoryRepo.Setup(repo => repo.DeleteAsync(1)).Returns(Task.CompletedTask);

            var result = await _service.DeleteAsync(1);

            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data);
        }

        [TestMethod]
        public async Task DeleteAsync_ReturnsFailure_WhenCategoryNotExists()
        {
            _categoryRepo.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((Category)null);

            var result = await _service.DeleteAsync(99);

            Assert.IsFalse(result.Success);
        }
    }
}
