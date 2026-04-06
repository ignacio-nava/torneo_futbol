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
  nickname: string | null;
  penalties: string[];
}

export interface Team {
  name: string;
  role: "L" | "D";
  players: TeamPlayer[];
}

export interface Game {
  datetime: string;
  result: "L" | "D" | "T" | null;
  is_finished: boolean;
  bonus: boolean;
  teams: Team[];
}

export interface TablePlayerRow {
  player: Player;
  total_points: number;
  games_played: number;
  games_won: number;
  games_lost: number;
  games_tied: number;
  games_with_bonus: number;
  last_matches: Array<"L" | "W" | "T" | "_">;
}
export interface TableRow {
  players: TablePlayerRow[]
}

export interface Selected {
  tournament: Tournament;
  games: Game[];
  table: TableRow
}



// Define la forma del contexto
export interface ContextData {
  tournaments: Tournament[];
  selected: Selected;
}

