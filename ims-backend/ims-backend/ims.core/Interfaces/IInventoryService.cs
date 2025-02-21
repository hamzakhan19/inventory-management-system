using ims.data.Models;

namespace ims.core.Interfaces
{
    public interface IInventoryService
    {
        bool StockIn(int productId, int quantity);
        bool StockOut(int productId, int quantity);
    }
}
