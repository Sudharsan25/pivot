import { Injectable, Logger } from '@nestjs/common';
import { eq, desc, count } from 'drizzle-orm';
import { DbService } from '../db/db.service';
import { urges, Urge } from '../db/schema';
import { UrgeOutcome } from './dto/create-urge.dto';

export interface UrgeStats {
  totalResisted: number;
  totalGaveIn: number;
  totalUrges: number;
}

export interface PaginatedUrges {
  urges: Urge[];
  total: number;
  limit: number;
  offset: number;
}

@Injectable()
export class UrgesService {
  private readonly logger = new Logger(UrgesService.name);

  constructor(private readonly dbService: DbService) {}

  /**
   * Log a new urge entry
   */
  async logUrge(
    userId: string,
    outcome: UrgeOutcome,
    urgeType: string,
    trigger?: string,
    notes?: string,
  ): Promise<Urge> {
    try {
      const [newUrge] = await this.dbService.db
        .insert(urges)
        .values({
          userId,
          outcome,
          urgeType: urgeType,
          trigger: trigger || null,
          notes: notes || null,
        })
        .returning();

      this.logger.log(`Urge logged for user ${userId}: ${outcome}`);
      return newUrge;
    } catch (error) {
      this.logger.error('Failed to log urge', error);
      throw new Error('Failed to log urge');
    }
  }

  /**
   * Get paginated urges for a user
   */
  async getUserUrges(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<PaginatedUrges> {
    try {
      // Validate pagination parameters
      const validLimit = Math.max(1, Math.min(100, limit)); // Between 1 and 100
      const validOffset = Math.max(0, offset);

      // Get total count
      const [totalResult] = await this.dbService.db
        .select({ count: count() })
        .from(urges)
        .where(eq(urges.userId, userId));

      const total = totalResult?.count || 0;

      // Get paginated urges, ordered by created_at descending (newest first)
      const userUrges = await this.dbService.db
        .select()
        .from(urges)
        .where(eq(urges.userId, userId))
        .orderBy(desc(urges.createdAt))
        .limit(validLimit)
        .offset(validOffset);

      return {
        urges: userUrges,
        total,
        limit: validLimit,
        offset: validOffset,
      };
    } catch (error) {
      this.logger.error('Failed to get user urges', error);
      throw new Error('Failed to retrieve urges');
    }
  }

  /**
   * Get urge statistics for a user
   */
  async getUrgeStats(userId: string): Promise<UrgeStats> {
    try {
      const stats = await this.dbService.db
        .select({
          outcome: urges.outcome,
          count: count(),
        })
        .from(urges)
        .where(eq(urges.userId, userId))
        .groupBy(urges.outcome);

      let totalResisted = 0;
      let totalGaveIn = 0;

      for (const stat of stats) {
        if (stat.outcome === 'resisted') {
          totalResisted = Number(stat.count);
        } else if (stat.outcome === 'gave_in') {
          totalGaveIn = Number(stat.count);
        }
      }

      const totalUrges = totalResisted + totalGaveIn;

      return {
        totalResisted,
        totalGaveIn,
        totalUrges,
      };
    } catch (error) {
      this.logger.error('Failed to get urge stats', error);
      throw new Error('Failed to retrieve urge statistics');
    }
  }

  /**
   * Get urge statistics by urge type for a user
   */
  async getUrgeStatsByType(userId: string): Promise<
    Array<{
      urgeType: string;
      totalResisted: number;
      totalGaveIn: number;
      totalUrges: number;
    }>
  > {
    try {
      const stats = await this.dbService.db
        .select({
          urgeType: urges.urgeType,
          outcome: urges.outcome,
          count: count(),
        })
        .from(urges)
        .where(eq(urges.userId, userId))
        .groupBy(urges.urgeType, urges.outcome);

      // Aggregate by urge type
      const byType = new Map<
        string,
        { totalResisted: number; totalGaveIn: number }
      >();

      for (const stat of stats) {
        const type = stat.urgeType;
        if (!byType.has(type)) {
          byType.set(type, { totalResisted: 0, totalGaveIn: 0 });
        }
        const counts = byType.get(type)!;
        if (stat.outcome === 'resisted') {
          counts.totalResisted += Number(stat.count);
        } else if (stat.outcome === 'gave_in') {
          counts.totalGaveIn += Number(stat.count);
        }
      }

      // Format response
      const result = Array.from(byType.entries()).map(([urgeType, counts]) => ({
        urgeType,
        totalResisted: counts.totalResisted,
        totalGaveIn: counts.totalGaveIn,
        totalUrges: counts.totalResisted + counts.totalGaveIn,
      }));

      // Sort by total urges descending
      result.sort((a, b) => b.totalUrges - a.totalUrges);

      return result;
    } catch (error) {
      this.logger.error('Failed to get urge stats by type', error);
      throw new Error('Failed to retrieve urge statistics by type');
    }
  }

  /**
   * Get time-series counts per urge type for the given time window.
   * If date is provided, defaults to hourly bucket for that day.
   * Otherwise uses bucket and days parameters.
   * Returns rows of { bucket: ISOString, urgeType, count }
   */
  async getUrgeTimeSeries(
    userId: string,
    bucket: 'day' | 'hour' = 'hour',
    days: number = 30,
    date?: string,
  ): Promise<Array<{ bucket: string; urgeType: string; count: number }>> {
    try {
      this.logger.log(
        `[getUrgeTimeSeries] Fetching for userId=${userId}, bucket=${bucket}, days=${days}, date=${date}`,
      );

      let sql: string;
      let params: any[];

      if (date) {
        // If date is provided, always use hourly bucket for that specific date
        sql = `SELECT date_trunc('hour', created_at) as bucket, urge_type, count(*)::text as count
               FROM urges
               WHERE user_id = $1 AND DATE(created_at) = $2
               GROUP BY bucket, urge_type
               ORDER BY bucket ASC`;
        params = [userId, date];
      } else {
        // Otherwise, use bucket and days
        const bucketStr = bucket === 'hour' ? 'hour' : 'day';
        sql = `SELECT date_trunc('${bucketStr}', created_at) as bucket, urge_type, count(*)::text as count
               FROM urges
               WHERE user_id = $1 AND created_at >= now() - interval '${days} days'
               GROUP BY bucket, urge_type
               ORDER BY bucket ASC`;
        params = [userId];
      }

      const rows: Array<{ bucket: Date; urge_type: string; count: string }> =
        await this.dbService.client.unsafe(sql, params);

      this.logger.log(
        `[getUrgeTimeSeries] Raw query returned ${rows.length} rows`,
      );
      this.logger.debug(`[getUrgeTimeSeries] Raw rows:`, JSON.stringify(rows));

      // Normalize response
      const result = rows.map((r) => ({
        bucket: new Date(r.bucket).toISOString(),
        urgeType: r.urge_type,
        count: Number(r.count),
      }));

      this.logger.log(
        `[getUrgeTimeSeries] Normalized result (${result.length} entries):`,
        JSON.stringify(result),
      );
      return result;
    } catch (error) {
      this.logger.error('Failed to get time-series data', error);
      throw new Error('Failed to retrieve time-series data');
    }
  }
}
