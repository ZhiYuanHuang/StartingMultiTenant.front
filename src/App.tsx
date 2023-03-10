import { Admin, combineDataProviders, CustomRoutes, DataProviderContext, EditGuesser, ListGuesser, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { Route } from "react-router-dom";
import { UserList } from "./users";
import { PostEdit, PostList } from "./posts";
import { Dashboard } from "./Dashboard";
import authProvider from "./authProvider";
import { dataProvider } from "./dataProvider";
import { BatchExecuteTask, TenantCreate, TenantCreateModify, TenantList } from "./tenants";
import { TenantDomainCreate, TenantDomainList } from "./tenantDomains";
import { ApiClientCreate, ApiClientList, ApiClientModifySecret, ApiClientAuthorize } from "./apiClients";
import { ServiceInfoCreate, ServiceInfoList, ServiceInfoModify } from "./serviceInfos";
import { DbInfoCreate, DbInfoList, DbInfoModify } from "./dbInfos";
import { DbServerCreate, DbServerEdit, DbServerExchange, DbServerList, DbServerShow } from "./dbServers";
import { CreateDbScriptCreate, CreateDbScriptList, CreateDbScriptShow } from "./createDbScripts";
import { uploadFileProvider } from "./uploadFileProvider";
import { SchemaUpdateScriptCreate, SchemaUpdateScriptExecute, SchemaUpdateScriptList, SchemaUpdateScriptShow } from "./schemaupdatescripts";
import { ExternalDbConnCreate, ExternalDbConnList, ExternalDbConnModify, ExternalDbConnShow, TenantExternalDbConnCreate, TenantExternalDbConnList } from "./externalDbConns";
import { InternalDbConnShow, TenantInternalDbConnList } from "./internalDbConns";

//const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const combineDataProvider = combineDataProviders((resource) => {
  switch (resource) {
    case 'schemaupdatescript':
    case 'createDbScript':
      return uploadFileProvider;
    default:
      return dataProvider;
  }
});

const App = () => (
  <Admin authProvider={authProvider} dataProvider={combineDataProvider}>
    <Resource name="apiClient" list={ApiClientList} create={ApiClientCreate} edit={ApiClientModifySecret}></Resource>
    <Resource name="serviceInfo" list={ServiceInfoList} create={ServiceInfoCreate} edit={ServiceInfoModify} recordRepresentation="identifier"></Resource>
    <Resource name="dbInfo" list={DbInfoList} create={DbInfoCreate} edit={DbInfoModify}></Resource>
    <Resource name="dbServer" list={DbServerList} create={DbServerCreate} show={DbServerShow} edit={DbServerEdit} recordRepresentation={(record) => `${record.dbType==0?"Postgres":"Mysql"}-${record.serverHost}:${record.serverPort}`}></Resource>
    <Resource name="createDbScript" list={CreateDbScriptList} create={CreateDbScriptCreate} show={CreateDbScriptShow} recordRepresentation={(record) => `${record.name}(${record.majorVersion})`}></Resource>
    <Resource name="schemaupdatescript" list={SchemaUpdateScriptList} create={SchemaUpdateScriptCreate} show={SchemaUpdateScriptShow}></Resource>
    <Resource name="tenantDomain" list={TenantDomainList} create={TenantDomainCreate} recordRepresentation="tenantDomain"></Resource>
    <Resource name="tenant" list={TenantList} create={TenantCreate} edit={TenantCreateModify}></Resource>
    <Resource name="externalDbConn" list={ExternalDbConnList} create={ExternalDbConnCreate} edit={ExternalDbConnModify} show={ExternalDbConnShow}></Resource>
    <Resource name="internalDbConn" show={InternalDbConnShow} />
    <CustomRoutes>
      <Route path="/clientAuthorize/:id" element={<ApiClientAuthorize />} />
      <Route path="/dbserverExchange/:id" element={<DbServerExchange />} />
      <Route path="/batchExecute" element={<BatchExecuteTask />}></Route>
      <Route path="/internalDbConn" element={<TenantInternalDbConnList />} />
      <Route path="/externalDbConn/create" element={<TenantExternalDbConnCreate />} />
      <Route path="/schemaupdatescript/execute" element={<SchemaUpdateScriptExecute></SchemaUpdateScriptExecute>}></Route>
    </CustomRoutes>
  </Admin>
)

export default App
