using CAFfrMAPBack.Models;
using CAFfrMAPBack.Services;
using System.Collections.Generic;
using System.Web.Http;

namespace CAFfrMAPBack.Controllers
{

    public class POIController : ApiController
    {
        private IPOIProvider provider;

        public POIController(IPOIProvider provider) : base()
        {
            this.provider = provider;
        }

        public IEnumerable<POI> Get()
        {
            return this.provider.GetAll();
        }
    }
}