using System.Web.Http;

namespace CAFfrMAPBack
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            UnityConfig.RegisterComponents();                           // <----- Add this line

            GlobalConfiguration.Configure(WebApiConfig.Register);

        }
    }
}
