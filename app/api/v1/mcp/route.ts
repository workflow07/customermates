import { createMcpRoute } from "./mcp-route-utils";

import {
  batchCreateContactsTool,
  batchUpdateContactNameTool,
  batchSetContactOrganizationsTool,
  batchSetContactUsersTool,
  batchSetContactDealsTool,
} from "@/features/mcp-tools/contact.mcp-tools";
import {
  batchCreateOrganizationsTool,
  batchUpdateOrganizationNameTool,
  batchSetOrganizationContactsTool,
  batchSetOrganizationUsersTool,
  batchSetOrganizationDealsTool,
} from "@/features/mcp-tools/organization.mcp-tools";
import {
  batchCreateDealsTool,
  batchUpdateDealNameTool,
  batchSetDealOrganizationsTool,
  batchSetDealUsersTool,
  batchSetDealContactsTool,
  batchSetDealServicesTool,
} from "@/features/mcp-tools/deal.mcp-tools";
import {
  batchCreateServicesTool,
  batchUpdateServiceNameAmountTool,
  batchSetServiceUsersTool,
  batchSetServiceDealsTool,
} from "@/features/mcp-tools/service.mcp-tools";
import {
  batchCreateTasksTool,
  batchUpdateTaskNameTool,
  batchSetTaskUsersTool,
} from "@/features/mcp-tools/task.mcp-tools";
import {
  getWidgetsTool,
  batchGetWidgetDetailsTool,
  createWidgetTool,
  updateWidgetGroupingTool,
  updateWidgetAggregationTool,
  updateWidgetEntityFiltersTool,
  updateWidgetDealFiltersTool,
  updateWidgetDisplayOptionsTool,
} from "@/features/mcp-tools/widget.mcp-tools";
import {
  listWebhooksTool,
  createWebhookTool,
  updateWebhookTool,
  deleteWebhookTool,
} from "@/features/mcp-tools/webhook.mcp-tools";
import { getUserDetailsTool, getUsersTool } from "@/features/mcp-tools/user.mcp-tools";
import { getCompanyDetailsTool, getRolesTool } from "@/features/mcp-tools/company.mcp-tools";
import {
  addPlainCustomColumnTool,
  addDateCustomColumnTool,
  addDateTimeCustomColumnTool,
  addCurrencyCustomColumnTool,
  addSingleSelectCustomColumnTool,
  addLinkCustomColumnTool,
  addEmailCustomColumnTool,
  addPhoneCustomColumnTool,
} from "@/features/mcp-tools/custom-column.mcp-tools";
import {
  getEntityConfigurationTool,
  filterEntityTool,
  countEntityTool,
  batchGetEntityDetailsTool,
  batchSetEntityNotesTool,
  batchDeleteEntityTool,
  batchUpdateEntityCustomFieldTool,
} from "@/features/mcp-tools/entity-generic.mcp-tools";

const ALL_TOOLS = [
  getEntityConfigurationTool,
  filterEntityTool,
  countEntityTool,
  batchGetEntityDetailsTool,
  batchSetEntityNotesTool,
  batchDeleteEntityTool,
  batchUpdateEntityCustomFieldTool,

  batchCreateContactsTool,
  batchUpdateContactNameTool,
  batchSetContactOrganizationsTool,
  batchSetContactUsersTool,
  batchSetContactDealsTool,

  batchCreateOrganizationsTool,
  batchUpdateOrganizationNameTool,
  batchSetOrganizationContactsTool,
  batchSetOrganizationUsersTool,
  batchSetOrganizationDealsTool,

  batchCreateDealsTool,
  batchUpdateDealNameTool,
  batchSetDealOrganizationsTool,
  batchSetDealUsersTool,
  batchSetDealContactsTool,
  batchSetDealServicesTool,

  batchCreateServicesTool,
  batchUpdateServiceNameAmountTool,
  batchSetServiceUsersTool,
  batchSetServiceDealsTool,

  batchCreateTasksTool,
  batchUpdateTaskNameTool,
  batchSetTaskUsersTool,

  getWidgetsTool,
  batchGetWidgetDetailsTool,
  createWidgetTool,
  updateWidgetGroupingTool,
  updateWidgetAggregationTool,
  updateWidgetEntityFiltersTool,
  updateWidgetDealFiltersTool,
  updateWidgetDisplayOptionsTool,

  listWebhooksTool,
  createWebhookTool,
  updateWebhookTool,
  deleteWebhookTool,

  getUserDetailsTool,
  getUsersTool,

  getCompanyDetailsTool,
  getRolesTool,

  addPlainCustomColumnTool,
  addDateCustomColumnTool,
  addDateTimeCustomColumnTool,
  addCurrencyCustomColumnTool,
  addSingleSelectCustomColumnTool,
  addLinkCustomColumnTool,
  addEmailCustomColumnTool,
  addPhoneCustomColumnTool,
];

const handler = createMcpRoute(ALL_TOOLS, "/api/v1/mcp");

export { handler as GET, handler as POST };
