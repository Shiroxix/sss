import { describe, expect, it } from "vitest";
import axios from "axios";

describe("BRAWL_TOKEN validation", () => {
  it("should successfully authenticate with the Brawl Stars API", async () => {
    const token = process.env.BRAWL_TOKEN;
    expect(token).toBeTruthy();

    // Test with a lightweight endpoint - get a known player
    const res = await axios.get(
      "https://api.brawlstars.com/v1/players/%23P90RJJY0Y",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 10000,
        validateStatus: () => true,
      }
    );

    // 200 = success, 404 = tag not found (but auth worked), both mean token is valid
    expect([200, 404]).toContain(res.status);
    // Should NOT be 401 (unauthorized) or 403 (forbidden)
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});
