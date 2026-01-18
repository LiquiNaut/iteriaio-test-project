import React from "react";
import { render } from "@testing-library/react";
import { Refine, DataProvider, DataProviders } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { MemoryRouter } from "react-router";
import { mockDataProvider } from "./mocks/dataProvider";

interface RenderOptions {
  dataProvider?: DataProvider | DataProviders;
}

export const renderWithRefine = (
  ui: React.ReactNode,
  options?: RenderOptions
) => {
  return render(
    <MemoryRouter initialEntries={["/documents"]}>
      <Refine
        dataProvider={options?.dataProvider ?? mockDataProvider}
        routerProvider={routerProvider}
        resources={[
          {
            name: "documents",
            list: "/documents",
            create: "/documents/create",
            edit: "/documents/edit/:id",
            show: "/documents/show/:id",
          },
        ]}
        options={{
          reactQuery: {
            clientConfig: {
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            },
          },
        }}
      >
        {ui}
      </Refine>
    </MemoryRouter>
  );
};
