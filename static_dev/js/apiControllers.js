"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = "http://127.0.0.1:8000/api/torneo/";
function getTorneoData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${API_URL}${id}/`;
        try {
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching tournament:", error);
            throw error;
        }
    });
}
if (tournamentsNav) {
    const tournaments = tournamentsNav.children;
    [...tournaments].forEach((child) => {
        child.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
            const tournament = e.target;
            tournament.dataset.status = "active";
            deactivateTournamet(tournaments, tournament);
            const tournamentData = yield getTorneoData(tournament.dataset.id);
            replaceData(tournamentData === null || tournamentData === void 0 ? void 0 : tournamentData.selected);
        }));
    });
}
