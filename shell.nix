{ pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [act deno];
}