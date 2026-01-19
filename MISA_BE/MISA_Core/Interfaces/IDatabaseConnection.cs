using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Interfaces
{
    public interface IDatabaseConnection
    {
        IDbConnection Connection();
    }
}
