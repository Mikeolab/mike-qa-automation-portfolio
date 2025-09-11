import { Header } from "./Header";

const PublicLayout = ({ children }) => {
  return (
    <div className="bg-dashboard-1">
      <Header />
      <div className="o-main-wrapper overflow-hidden">
        <section className="o-dasboard">
          <div className="o-dasboard__spacing">
            <div className="o-container">
              <div className="o-dasboard__container">
                {children}
                {/* {isCustomerPage ? (
                  <Router />
                ) : (
                  <div className="o-dasboard__flexwrapper">
                    <div className="o-dasboard__left">
                      <Sidebar />
                    </div>
                    <div className="o-dasboard__right">
                      {isSuperAdminPage ? <SuperAdminRouter /> : <Router />}
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PublicLayout;
