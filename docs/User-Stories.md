# User Stories

## Project Name: Riseon

**Value Proposition:** Riseon is a platform where crypto influencers sell their copy trades, create exclusive clubs for alpha sharing, and sell various digital goods related to crypto trading. It also gives power back to novice traders and balances the ecosystem by allowing traders who follow influencers to rate, review and view the past performance of these copy trades they are buying.

**Product-Market Fit:** Riseon achieves product-market fit by serving both crypto influencers seeking ethical monetization and novice traders demanding scam-resistant tools through a platform that merges anti-rug copy trading, exclusive alpha clubs, and community-driven accountability. Riseon disrupts Telegram’s risky bot ecosystems, by enabling influencers and trading experts to profit from their time-tested strategies and exclusive content while empowering users with transparent performance metrics. The platform aligns influencer success with follower trust, creating a balanced, fraud-resistant ecosystem where transparency drives growth and reduces systemic scams.

## Target User Profiles

### Crypto Influencers:

- **Demographics:** Aged 28-45, professionals with strong connections to industry, living in hub cities and major financial centers.
- **Interests:** Traders and avid social media users, looking towards monetizing their audience, and expanding their reach.
- **Motivations:** Revenue, reaching more users, and cultural impact.

### Novice Traders (Degens):

- **Demographics:** Aged 18-35, tech-savvy novice traders
- **Interests:** cryptocurrencies, gaming and online communities
- **Motivations:** interested in learning, and participating in crypto-trading communities. Wary of the numerous scams in trading communities.

## User Persona: Crypto Influencer

Name: "Kate"

Kate has been trading cryptocurrency since the beginning of the last cycle, and all the while tweeting about her experience. Due to her funny humor and personality, she has developed a devoted following on twitter.

Now Kate is searching for ways to monetize her audience in a meaningful way, that does not come across as a quick money grab or opportunistic.

## User Persona: Novice Trader (Degen)

Name: "Mackson"

Mackson, who is in college at the moment, has come to learn about cryptocurrency meme coins from his friends. For the last few weeks, he has been dabbling with various pump.fun trades. Having lost a few hundred dollars on pump.fun trades, he's now looking to learn more about trading, if possible from a mentor.

Mackson has been following Kate on twitter, and is impressed by her trading tweets. He is interested in the way she trades, and would love to join her exclusive club.

## User Stories

### User Story: RS-001 (User Profiles)

- **Persona:** Kate, Crypto Influencer
- **Goal:** Show that I'm a genuine trader
- **User Story:** As an influencer, I want to show that I have reputation and credibility.
- **Functionality:** The platform should allow me to:
  - Create a profile as an expert trader
- **User Interactions:** I should be able to:
  - Link my twitter account
  - Update my bio
  - Update my picture
- **Attributes:** The profile should focus on my:
  - Reputation
- **Priority:** High

### User Story: RS-002 (Copy Trading)

- **Persona:** Kate, Crypto Influencer
- **Goal:** Earn trading volume revenue while trading for others.
- **User Story:** As an expert trader, I want to operate a copy trading system that earns me revenue on volume.
- **Functionality:** The platform should allow me to:
  - Create a multi-user trading vault
  - Users should be to deposit and withdraw from the vault
  - Track balances correctly for each individual vault user
  - Earn fees on the trades
- **User Interactions:** I should be able to:
  - Buy and sell coins on Jupiter aggregator using the vault
- **Attributes:** The vault should be:
  - Secure
  - Transparent
- **Priority:** Medium

### User Story: RS-003 (Exclusive Clubs)

- **Persona:** Kate, Crypto Influencer
- **Goal:** Earn subscription revenue from my insider club.
- **User Story:** As an expert trader, I want to operate an exclusive club for those who want to follow my trades and learn from me.
- **Functionality:** The platform should allow me to:
  - Create a group chat
  - Collect subscription fees from those who join
  - Mint NFTs for the group
- **User Interactions:** I should be able to:
  - Post updates to the group
- **Attributes:** The groups should be:
  - Exclusive
  - High-value
  - Secure (to protect against alpha leaks)
- **Priority:** Medium

### User Story: RS-004 (Ratings & Reviews)

- **Persona:** Mackson, Novice Trader
- **Goal:** Read reviews and compare trading experts
- **User Story:** As a novice trader, I want to be able to know who I can trust in the  trading ecosystem.
- **Functionality:** The platform should allow me to:
  - Review and rate profiles
- **User Interactions:** I should be able to:
  - Write a review about a trader I had an interaction with
- **Attributes:** Users should be able to gauge:
  - Reputation
  - Transparency
- **Priority:** Medium

---

## Extended Goals for After Capstone/Hackathon

### User Story: RS-005 (Anti-Rug)

- **Persona:** Mackson, Novice Trader
- **Goal:** My funds to be secure, protected against possible scams.
- **User Story:** As a novice trader, I want to be assured that my funds will not be appropriated by the expert trader through some nefarious scheme.
- **Functionality:** The platform should protect against:
  - Possible rugs, by monitoring invested pools for depletion using off-chain bots, and then triggering trades.
- **User Interactions:** No user interaction necessary.
- **Attributes:** Users should feel:
  - Secure
  - Safe
- **Priority:** Low

### User Story: RS-006 (Mobile-Friendly)

- **Persona:** Mackson, Novice Trader
- **Goal:** I want to be able to track my portfolio at all times
- **User Story:** As a busy person, I want to be able to track my portfolio at all times.
- **Functionality:** The platform should be:
  - Mobile friendly
  - UX built for simple easy to understand interactions
- **User Interactions:** I want the platform to be:
  - Able to understand the trading system without technical jargon
- **Attributes:** Users should feel:
  - Easy to understand
  - Comfortable
- **Priority:** Low

### User Story: RS-007 (Fast Sniping)

- **Persona:** Mackson, Novice Trader
- **Goal:** I want to land snipes as fast as possible for maximum gain.
- **User Story:** As a trader in a PvP arena, I want  the earliest trades possible when trading against other users.
- **Functionality:** The platform should:
  - Use the fastest RPC connection for lowest latency trades
- **User Interactions:** No user interaction necessary
- **Attributes:** User should fee:
  - Secure
  - Safe
- **Priority:** Low

### User Story: RS-008 (Advanced Trades)

- **Persona:** Kate, Crypto Influencer
- **Goal:** I should be able to manage large funds in the vault safely.
- **User Story:** As an expert who is managing funds for others, I want access to tools that can best preserve value for my users.
- **Functionality:** The platform should allow me:
  - Use advanced trading functionality for each trade I place
- **User Interactions:** I should be able to:
  - Set slippage
  - Create limit orders
  - Create VWAP orders
  - Create TWAP orders
- **Attributes:** The trading system should be:
  - Modern (Advanced/Contemporary/Feature-rich etc)
- **Priority:** Low

### User Story: RS-009 (Trading API)

- **Persona:** Kate, Crypto Influencer
- **Goal:** I should be able to automate the trading in the vault, for convenience.
- **User Story:** As an expert who is managing funds for others, the safest trading system is one which is automated.
- **Functionality:** The platform should allow:
  - Access to vault trading via API
- **User Interactions:** I should be able to:
  - Use scripts, bots or AI to place vaults trades
- **Attributes:** The trading system should be:
  - Easy to manage
- **Priority:** Low

*Note: other features under consideration--order triggers, stop loss, take profit, and other automations*
