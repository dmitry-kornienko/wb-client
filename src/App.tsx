import { Route, Routes } from "react-router-dom";
import { Paths } from "./paths";
import { Home } from "./pages/home";
import { Buy } from "./pages/buy";
import { Packed } from "./pages/packed";
import { Send } from "./pages/send";
import { ReportPage } from "./pages/report";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { AddComponent } from "./pages/add-component";
import { Status } from "./pages/status";
import { Component } from "./pages/component";
import { EditComponent } from "./pages/edit-component";
import { Complect } from "./pages/complect";
import { AddComplect } from "./pages/add-complect";
import { EditComplect } from "./pages/edit-complect";
import { AddBuyOperation } from "./pages/add-buyOperation";
import { EditBuyOperation } from "./pages/edit-buy-operation";
import { BuyOperation } from "./pages/buy-operation";
import { AddPackedOperation } from "./pages/add-packed-operation";
import { PackedOperation } from "./pages/packed-operation";
import { EditPackedOperation } from "./pages/edit-packed-operation";
import { SendOperation } from "./pages/send-operation";
import { AddSendOperation } from "./pages/add-send-operation";
import { EditSendOperation } from "./pages/edit-send-operation";
import { AddReport } from "./pages/add-report";
import { ReportOne } from "./pages/report-one";
import { EditReport } from "./pages/edit-report";
import { EditToken } from "./pages/edit-token";

export const App = () => {
    return (
        <Routes>
            <Route path={Paths.home} element={<Home />} />
            <Route path={Paths.buy} element={<Buy />} />
            <Route path={Paths.packed} element={<Packed />} />
            <Route path={Paths.send} element={<Send />} />
            <Route path={Paths.report} element={<ReportPage />} />
            <Route path={Paths.login} element={<Login />} />
            <Route path={Paths.register} element={<Register />} />

            <Route path={`${Paths.status}/:status`} element={<Status />} />

            <Route path={Paths.componentAdd} element={<AddComponent />} />
            <Route
                path={`${Paths.componentEdit}/:id`}
                element={<EditComponent />}
            />
            <Route path={`${Paths.component}/:id`} element={<Component />} />

            <Route path={Paths.complectAdd} element={<AddComplect />} />
            <Route
                path={`${Paths.complectEdit}/:id`}
                element={<EditComplect />}
            />
            <Route path={`${Paths.complect}/:id`} element={<Complect />} />

            <Route path={Paths.buyOperationAdd} element={<AddBuyOperation />} />
            <Route
                path={`${Paths.buyOperationEdit}/:id`}
                element={<EditBuyOperation />}
            />
            <Route
                path={`${Paths.buyOperation}/:id`}
                element={<BuyOperation />}
            />

            <Route
                path={Paths.packedOperationAdd}
                element={<AddPackedOperation />}
            />
            <Route
                path={`${Paths.packedOperationEdit}/:id`}
                element={<EditPackedOperation />}
            />
            <Route
                path={`${Paths.packedOperation}/:id`}
                element={<PackedOperation />}
            />

            <Route
                path={Paths.sendOperationAdd}
                element={<AddSendOperation />}
            />
            <Route
                path={`${Paths.sendOperationEdit}/:id`}
                element={<EditSendOperation />}
            />
            <Route
                path={`${Paths.sendOperation}/:id`}
                element={<SendOperation />}
            />

            <Route path={Paths.reportAdd} element={<AddReport />} />
            <Route path={`${Paths.reportEdit}/:id`} element={<EditReport />} />
            <Route path={`${Paths.report}/:id`} element={<ReportOne />} />

            <Route path={Paths.editToken} element={<EditToken />} />
        </Routes>
    );
};
