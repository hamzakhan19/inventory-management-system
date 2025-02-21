using ims.core.Interfaces;
using ims.data.Models;
using IMS.data.data;
using Microsoft.EntityFrameworkCore;

namespace ims.core.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly AppDbContext _context;

        public InventoryService(AppDbContext context)
        {
            _context = context;
        }

        public bool StockIn(int productId, int quantity)
        {
            var product = _context.Products.Find(productId);
            if (product == null) return false;

            product.Quantity += quantity;
            _context.SaveChanges();
            return true;
        }

        public bool StockOut(int productId, int quantity)
        {
            var product = _context.Products.Find(productId);
            if (product == null || product.Quantity < quantity) return false;

            product.Quantity -= quantity;
            _context.SaveChanges();
            return true;
        }
    }
}
