//using Microsoft.EntityFrameworkCore.Design;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using DotNetEnv;

//namespace Persistence
//{
//    public class BookStoreDbContextFactory : IDesignTimeDbContextFactory<BookStoreDbContext>
//    {


//        public BookStoreDbContext CreateDbContext(string[] args)
//        {
//            var apiProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "../BookStore");
//            var configuration = new ConfigurationBuilder()
//                .SetBasePath(apiProjectPath)
//                .AddJsonFile("appsettings.json")
//                .Build();

//            var builder = new DbContextOptionsBuilder<BookStoreDbContext>();
//            Env.Load("../.env");

//            var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

//            return new BookStoreDbContext(builder.Options);
//        }
//    }
//}


using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using DotNetEnv;

namespace Persistence
{
    public class BookStoreDbContextFactory : IDesignTimeDbContextFactory<BookStoreDbContext>
    {
        public BookStoreDbContext CreateDbContext(string[] args)
        {
            // Load .env file if it exists
            Env.Load("../.env");

            var apiProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "../BookStore");
            var configuration = new ConfigurationBuilder()
                .SetBasePath(apiProjectPath)
                .AddJsonFile("appsettings.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<BookStoreDbContext>();

            // Try environment variable first, then appsettings.json
            var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING")
                                 ?? configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException(
                    "Connection string not found. Set CONNECTION_STRING environment variable or add DefaultConnection to appsettings.json");
            }

            builder.UseNpgsql(connectionString);
            return new BookStoreDbContext(builder.Options);
        }
    }
}