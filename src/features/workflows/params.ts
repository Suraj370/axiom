import { PAGINATION } from "@/constants/pagination";
import { createLoader } from "nuqs/server";
import { parseAsInteger, parseAsString } from "nuqs/server";

export const workflowsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const workflowParamsLoader = createLoader(workflowsParams);