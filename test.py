# from color_resolver import color_resolver
from cube_solver import *
from solution import solution
from webcam import *

sc = scan_cube()
colors = sc.get_rgb_of_all_faces()
faces = ['f','b','l','r','u','d']
input = {}

for face in faces:
	input[face] = list(colors[face].values())


# input = {'f':['r','g','w','w','b','y','w','r','g'],
# 		 'b':['y','o','b','y','g','y','o','o','y'],
# 		 'u':['r','w','r','o','r','r','y','r','r'],
# 		 'd':['o','w','o','w','o','b','o','g','w'],
# 		 'l':['w','b','b','r','y','b','b','g','b'],
# 		 'r':['g','b','g','o','w','g','y','y','g']
# 		}

solver = cube_solver(input)
debug = True
ans = solver.solve(debug)
print("=============================RESULTS===============================")
print("Things to keep in mind:")
print("Blue center stays in front, Red center in top and white center in right from starting to end.")
print("\nface significance:")
print("f : front face\nb : back face\nd : down face\nu : up face\nl : left face\nr : right face")
print("\nmove significance:")
print("f  : front face clockwise\nf1 : front face anti-clockwise\nf2 : front face two-times (Trust me,Direction doesn't matter!)")
print("\nmf : turn center column of front face clockwise with respect to right(white) face")
print("mr : turn center column of right face clockwise with respect to back(green) face")
print("mc : turn center row of front face clockwise with respect to down(orange) face")
print("\n\nTotal steps to solve: ",ans.length)
print("Steps to folow: ",ans.ans)
print("Time taken by program to execute :",ans.time,"secs")
print("Yipee! SOLVED") if ans.status else print("Can't be solved")
