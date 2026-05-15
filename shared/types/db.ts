export type DbId = string;
export type IsoDateTime = string;

export type PickedCard = { id: number; isReversed: boolean };

export type Journey = {
  id: DbId;
  user_id: DbId;
  title: string;
  description: string;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
  icon?: string | null;
};

export type Step = {
  id: DbId;
  user_id: DbId;
  journey_id: DbId;
  title: string;
  cards?: PickedCard[] | null;
  meaning?: string | null;
  note?: string | null;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
};

export type Category = {
  id: DbId;
  user_id: DbId;
  title: string;
  color: string;
  created_at: IsoDateTime;
};

export type Favorite = {
  id: DbId;
  user_id: DbId;
  journey_id: DbId;
  created_at: IsoDateTime;
};

export type JourneyCategory = {
  id?: DbId;
  user_id?: DbId;
  journey_id: DbId;
  category_id: DbId;
  created_at?: IsoDateTime;
};

