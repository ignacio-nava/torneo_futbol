export interface Tournament {
  id: number | null;
  name: string | null;
  start_date: string | null;
  end_date: string | null;
  finished: boolean;
}

export interface Player {
  id: number;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
}

export interface TeamPlayer {
  id: number;
  nickname: string | null;
}

export interface Team {
  name: string;
  role: "L" | "D";
  players: TeamPlayer[];
}

export interface Game {
  id: number;
  datetime: string;
  result: "L" | "D" | "T" | null;
  is_finished: boolean;
  bonus: boolean;
  teams: Team[];
}

export interface Event {
  game__id: number;
  players__id: number;
  players__nickname: string;
  event__id: number;
  event__name: string | null;
  event__code: string | null;
  event__points: number;
  event__in_game: boolean;
}

export interface TablePlayerRow {
  player: Player;
  total_points: number;
  games_played: number;
  games_won: number;
  games_lost: number;
  games_tied: number;
  games_with_bonus: number;
  has_extra_points: boolean;
  last_matches: Array<"L" | "W" | "T" | "_">;
}

export interface TableEventRow {
  event_id: number;
  event_name: string;
  event_code: string;
  event_count: number;
  total_event_points: number;
}

export interface TableEventPlayerRow {
  player_id: number;
  player_nickname: string;
  points_to_table: number;
  events: TableEventRow[];
}

export interface TableRow {
  players: TablePlayerRow[];
  events_by_player: TableEventPlayerRow[];
}

export interface Selected {
  tournament: Tournament;
  games: Game[];
  table: TableRow,
  events: Event[]
}



// Define la forma del contexto
export interface ContextData {
  tournaments: Tournament[];
  selected: Selected;
}

