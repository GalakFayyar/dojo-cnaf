using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CAFfrMAPBack.Models;

namespace CAFfrMAPBack.Services
{
    public class POIProvider : IPOIProvider
    {
        private IEnumerable<POI> data;

        public POIProvider(IEnumerable<POI> data)
        {
            this.data = data;
        }
        public IEnumerable<POI> GetAll()
        {
            return data;
        }
    }
}