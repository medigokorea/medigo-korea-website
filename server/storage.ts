import { quotationRequests, contactRequests, type QuotationRequest, type ContactRequest, type InsertQuotationRequest, type InsertContactRequest } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createQuotationRequest(request: InsertQuotationRequest): Promise<QuotationRequest>;
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getQuotationRequests(): Promise<QuotationRequest[]>;
  getContactRequests(): Promise<ContactRequest[]>;
  updateContactRequestStatus(id: number, status: string): Promise<ContactRequest>;
}

export class DatabaseStorage implements IStorage {
  async createQuotationRequest(insertRequest: InsertQuotationRequest): Promise<QuotationRequest> {
    const [request] = await db
      .insert(quotationRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const [request] = await db
      .insert(contactRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getQuotationRequests(): Promise<QuotationRequest[]> {
    const requests = await db
      .select()
      .from(quotationRequests)
      .orderBy(desc(quotationRequests.createdAt));
    return requests;
  }

  async getContactRequests(): Promise<ContactRequest[]> {
    const requests = await db
      .select()
      .from(contactRequests)
      .orderBy(desc(contactRequests.createdAt));
    return requests;
  }

  async updateContactRequestStatus(id: number, status: string): Promise<ContactRequest> {
    const [request] = await db
      .update(contactRequests)
      .set({ status })
      .where(eq(contactRequests.id, id))
      .returning();
    return request;
  }
}

export const storage = new DatabaseStorage();
