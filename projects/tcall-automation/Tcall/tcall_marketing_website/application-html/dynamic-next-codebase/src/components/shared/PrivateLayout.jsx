import { Header } from "./Header";
import Sidebar from "./Sidebar";

const PrivateLayout = ({ children }) => {
  return (
    <div className="bg-dashboard-1">
      <Header />
      <div className="o-main-wrapper overflow-hidden">
        <section className="o-dasboard">
          <div className="o-dasboard__spacing">
            <div className="o-container">
              <div className="o-dasboard__container">
                <div className="o-dasboard__flexwrapper">
                  <div className="o-dasboard__left">
                    <Sidebar />
                  </div>
                  <div className="o-dasboard__right">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivateLayout;
