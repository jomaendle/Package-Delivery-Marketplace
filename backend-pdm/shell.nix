{nixpkgs ? import <nixpkgs> {}, ghc ? nixpkgs.ghc}:

with nixpkgs;

haskell.lib.buildStackProject {
  inherit ghc;
  name = "myEnv";
  buildInputs = [ glpk pcre haskellPackages.Spock haskellPackages.base haskellPackages.aeson haskellPackages.text ];
}


