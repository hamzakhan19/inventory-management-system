using ims.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ims.core.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product?> UpdateProductAsync(int id, Product product);
        Task<Product> AddProductAsync(Product product);
        Task<bool> DeleteProductAsync(int id);
    }
}
